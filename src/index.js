import { readFileSync } from 'fs';

function rearrangeNodes(nodes) {
  // Create a dictionary to store children for each parent nodeId
  const parentChildren = {};

  // Find the root-level nodes and build the parentChildren dictionary
  for (const node of nodes) {
    const parentId = node.parentId;
    if (parentId !== null) {
      parentChildren[parentId] = parentChildren[parentId] || [];
      parentChildren[parentId].push(node);
    }
  }

  // Build the tree structure for each root-level node
  const rootNodes = nodes.filter((node) => node.parentId === null);
  for (const rootNode of rootNodes) {
    buildTree(rootNode,parentChildren);
  }

  // Return the tree structure for all root-level nodes
  return rootNodes;
}

 // Helper function to recursively build the tree structure
 function buildTree(node,parentChildren) {
  const children = parentChildren[node.nodeId] || [];
  // Sort the children based on their previousSiblingId, if available
  children.sort((a, b) => (a.previousSiblingId || '').localeCompare(b.previousSiblingId || ''));
  for (const child of children) {
    buildTree(child,parentChildren);
  }
  node.children = children;
}

function main() {
  // Load the input data from the JSON file
  const nodesData = readFileSync('input/nodes.json', 'utf8');
  const nodes = JSON.parse(nodesData);
  
  // Rearrange the nodes into a tree structure
  const tree = rearrangeNodes(nodes);

  // Convert the tree to JSON format and print the result
  const outputJson = JSON.stringify(tree, null, 2);
  console.log(outputJson);
}

main();
