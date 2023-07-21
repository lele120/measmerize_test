import { readFileSync } from 'fs';

function rearrangeNodes(nodes) {
  const parentChildren = {};
  const stack = [];

  for (const node of nodes) {
    const parentId = node.parentId;
    if (parentId !== null) {
      parentChildren[parentId] = parentChildren[parentId] || [];
      insertSorted(parentChildren[parentId], node);
    }
  }

  function insertSorted(arr, node) {
    let low = 0;
    let high = arr.length;

    while (low < high) {
      const mid = (low + high) >>> 1;
      const midNode = arr[mid];
      const midId = parseInt(midNode.previousSiblingId) || 0;
      const nodeId = parseInt(node.previousSiblingId) || 0;

      if (midId < nodeId) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    arr.splice(low, 0, node);
  }

  const rootNodes = nodes.filter((node) => node.parentId === null);
  stack.push(...rootNodes);

  while (stack.length > 0) {
    const node = stack.pop();
    const children = parentChildren[node.nodeId] || [];
    stack.push(...children);
    node.children = children;
  }

  return rootNodes;
}

function main() {
  const nodesData = readFileSync('input/nodes.json', 'utf8');
  const nodes = JSON.parse(nodesData);
  
  const tree = rearrangeNodes(nodes);

  const outputJson = JSON.stringify(tree, null, 2);
  console.log(outputJson);
}

main();
