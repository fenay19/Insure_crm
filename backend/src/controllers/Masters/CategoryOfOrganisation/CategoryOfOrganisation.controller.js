const { categoryOfOrganisationModel } = require('../../../models/index');

const getCategoryOfOrganisationController = async (req, res) => {
    try {
        const categories = await categoryOfOrganisationModel.find();
        res.status(200).json({ status: 'true', data: categories });
    } catch (error) {
        res.status(500).json({
            status: 'false',
            message: ['Error fetching categories of organisation', error.message],
        });
    }
};

const postCategoryOfOrganisationController = async (req, res) => {
    try {
        const { categoryOfOrganisation } = req.body;

        if (!categoryOfOrganisation) {
            return res.status(400).json({
                status: 'false',
                message: 'categoryOfOrganisation field is required',
            });
        }

        const newCategory = new categoryOfOrganisationModel({ categoryOfOrganisation });
        await newCategory.save();

        res.status(201).json({ status: 'true', data: newCategory });
    } catch (error) {
        res.status(500).json({
            status: 'false',
            message: ['Error creating category of organisation', error.message],
        });
    }
};

const putCategoryOfOrganisationController = async (req, res) => {
    try {
        const id = req.params.id;
        const { categoryOfOrganisation } = req.body;

        const updatedCategory = await categoryOfOrganisationModel.findByIdAndUpdate(
            id,
            { categoryOfOrganisation },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                status: 'false',
                message: 'Category of organisation not found',
            });
        }

        res.status(200).json({ status: 'true', data: updatedCategory });
    } catch (error) {
        res.status(500).json({
            status: 'false',
            message: ['Error updating category of organisation', error.message],
        });
    }
};

const deleteCategoryOfOrganisationController = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedCategory = await categoryOfOrganisationModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                status: 'false',
                message: 'Category of organisation not found',
            });
        }

        res.status(200).json({
            status: 'true',
            message: 'Category of organisation deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 'false',
            message: ['Error deleting category of organisation', error.message],
        });
    }
};

module.exports = {
    getCategoryOfOrganisationController,
    postCategoryOfOrganisationController,
    putCategoryOfOrganisationController,
    deleteCategoryOfOrganisationController,
};
