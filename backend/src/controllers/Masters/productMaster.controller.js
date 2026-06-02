const { ProductMasterModel } = require("../../models");
const httpStatus = require("http-status");

const addProduct = async (req, res) => {
  try {
    const { companyId } = req.query;
    const {
      productName,
      brandName,
      productId,
      sku,
      hsn,
      unit,
      category,
      store,
      productType,
      party,
      partyId,
      purchase,
      sales,
      consumption,
      purchaseGST,
      salesGST,
      genericName,
      sheduledDrug,
    } = req.body;

    if (!req.body) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Please provide all the required fields" });
    }
    const exsistinghsnProduct = await ProductMasterModel.findOne({ hsn: hsn });
    if (exsistinghsnProduct) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The product with this HSN code is already added" });
    }

    const exsistingskuProduct = await ProductMasterModel.findOne({ sku: sku });
    if (exsistingskuProduct) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The product with this SKU code is already added" });
    }

    const product = new ProductMasterModel({
      productName,
      brandName,
      productId,
      sku,
      companyId,
      hsn,
      unit,
      category,
      store,
      productType,
      party,
      partyId,
      purchase,
      sales,
      consumption,
      purchaseGST,
      salesGST,
      genericName,
      sheduledDrug,
    });
    await product.save();
    return res
      .status(httpStatus.CREATED)
      .json({ msg: "Product added successfully", product });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in adding a product", err });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    await product.save();
    res
      .status(httpStatus.OK)
      .json({ msg: "Product details updated successfully!!", product });
  } catch (err) {
    res
      .status(httpStatus.httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating party details", err });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { companyId } = req.query;
    const allProduct = await ProductMasterModel.find({
      delete: false,
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (!allProduct) {
      res.status(httpStatus.NOT_FOUND).json({ message: "No product found!!" });
    }
    res.status(httpStatus.OK).json({
      message: "Product found successfully!!",
      productCount: allProduct.length,
      allProduct,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the product11" }, err);
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const getProduct = await ProductMasterModel.findById({ _id: id });
    if (!getProduct || getProduct.delete === true) {
      res.status(httpStatus.NOT_FOUND).json({ msg: "Can't find the party!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Product found successfully!!", getProduct });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Can't fetch the party!!" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );
    if (!product) {
      res.status(httpStatus.NOT_FOUND).json({ message: "No party found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Product deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting party!!" });
  }
};

const bulkImport = async (req, res) => {
  try {
    const product = req.body;
    const result = await ProductMasterModel.insertMany(product);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Product added successfully", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  editProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  bulkImport,
};
