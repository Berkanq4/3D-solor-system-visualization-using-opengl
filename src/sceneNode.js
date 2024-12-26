/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

class SceneNode {
    constructor(meshDrawer, trs, parent = null) {
        this.meshDrawer = meshDrawer;
        this.trs = trs;
        this.parent = parent;
        this.children = [];

        if (parent) {
            this.parent.__addChild(this);
        }
    }

    __addChild(node) {
        this.children.push(node);
    }

    draw(mvp, modelView, normalMatrix, modelMatrix) {
        // Helper function to calculate updated matrices
        function applyTransformations(baseMatrix, transformation) {
            return MatrixMult(baseMatrix, transformation);
        }
        
        // Retrieve the transformation matrix for this node
        const nodeTransformation = this.trs.getTransformationMatrix();
        
        // Update all required matrices
        const updatedMatrices = {
            model: applyTransformations(modelMatrix, nodeTransformation),
            modelView: applyTransformations(modelView, nodeTransformation),
            mvp: applyTransformations(mvp, nodeTransformation),
            normals: applyTransformations(normalMatrix, nodeTransformation), // Assumes uniform scaling for normals
        };
        
        // Draw the current node if it has a MeshDrawer
        this.meshDrawer?.draw(
            updatedMatrices.mvp,
            updatedMatrices.modelView,
            updatedMatrices.normals,
            updatedMatrices.model
        );
        
        // Recursively process and render child nodes
        this.children.forEach(child =>
            child.draw(
            updatedMatrices.mvp,
            updatedMatrices.modelView,
            updatedMatrices.normals,
            updatedMatrices.model
            )
        );
  }
}
