class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.array = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(this.array, 0, this.array.length - 1);
  }

  buildTree(array, start, end) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const root = new Node(array[mid]);

    root.left = this.buildTree(array, start, mid - 1);
    root.right = this.buildTree(array, mid + 1, end);

    return root;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) return;

    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }

    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);

    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  insert(node = this.root, value) {
    if (node === null) return new Node(value);

    if (value < node.data) {
      node.left = this.insert(node.left, value);
    } else if (value > node.data) {
      node.right = this.insert(node.right, value);
    }

    return node;
  }

  deleteItem(node = this.root, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.deleteItem(node.left, value);
    } else if (value > node.data) {
      node.right = this.deleteItem(node.right, value);
    } else {
      if (node.left === null && node.left === null) {
        return null;
      }

      if (node.right === null) {
        return node.left;
      }
      if (node.left === null) {
        return node.right;
      }

      let minNode = this.findMin(node.right);
      node.data = minNode.data;
      node.right = this.deleteItem(node.right, minNode.data);
    }

    return node;
  }

  findMin(node) {
    while (node.left != null) {
      node = node.left;
    }
    return node;
  }

  find(node = this.root, value) {
    if (node === null) {
      console.log(`Value ${value} not found in the tree.`);
      return null;
    }

    if (value === node.data) {
      console.log(`Value ${value} found in the tree.`);
      return node;
    }
    if (value < node.data) {
      return this.find(node.left, value);
    } else {
      return this.find(node.right, value);
    }
  }

  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("a callback functon is required");
    }

    if (this.root === null) return null;

    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();

      callback(node);

      if (node.left !== null) {
        queue.push(node.left);
      }

      if (node.right !== null) {
        queue.push(node.right);
      }
    }
  }

  inOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("a callback function is required");
    }

    if (this.root === null) return null;

    let stack = [];
    let currentNode = this.root;

    while (stack.length > 0 || currentNode !== null) {
      while (currentNode !== null) {
        stack.push(currentNode);
        currentNode = currentNode.left;
      }

      currentNode = stack.pop();
      callback(currentNode);

      currentNode = currentNode.right;
    }
  }

  preOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("a callback function is required");
    }

    if (this.root === null) return null;

    const stack = [];
    let currentNode = this.root;

    stack.push(currentNode);

    while (stack.length > 0) {
      currentNode = stack.pop();
      callback(currentNode);

      if (currentNode.right !== null) {
        stack.push(currentNode.right);
      }

      if (currentNode.left !== null) {
        stack.push(currentNode.left);
      }
    }
  }

  postOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("a callback function is required");
    }

    if (this.root === null) return null;

    const stack1 = [];
    const stack2 = [];
    let currentNode = this.root;

    stack1.push(currentNode);

    while (stack1.length > 0) {
      currentNode = stack1.pop();
      stack2.push(currentNode);

      if (currentNode.left !== null) {
        stack1.push(currentNode.left);
      }

      if (currentNode.right !== null) {
        stack1.push(currentNode.right);
      }
    }

    while (stack2.length > 0) {
      currentNode = stack2.pop();
      callback(currentNode);
    }
  }

  height(node) {
    if (node === null) return -1;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node, current = this.root, currentdepth = 0) {
    if (current === null) return -1;

    if (current === node) {
      return currentdepth;
    }

    const leftDepth = this.depth(node, current.left, currentdepth + 1);

    if (leftDepth !== -1) {
      return leftDepth;
    }

    return this.depth(node, current.right, currentdepth + 1);
  }

  isBalanced(node = this.root) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    const leftBalanced = this.isBalanced(node.left);
    const rightBalanced = this.isBalanced(node.right);

    return (
      Math.abs(leftHeight - rightHeight) <= 1 && leftBalanced && rightBalanced
    );
  }

  inOrderTraversal(node, result = []) {
    if (node === null) return result;

    this.inOrderTraversal(node.left, result);
    result.push(node.data);
    this.inOrderTraversal(node.right, result);

    return result;
  }

  rebalance() {
    const sortedVal = this.inOrderTraversal(this.root);

    this.root = this.buildTree(sortedVal, 0, sortedVal.length - 1);
  }
}

function generateRandomNumbers(count, max = 200) {
  const numbers = new Set();

  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max));
  }

  return Array.from(numbers);
}

const newArr = generateRandomNumbers(7);

const tree = new Tree(newArr);

tree.prettyPrint();
