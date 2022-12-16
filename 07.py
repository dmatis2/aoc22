class Node:
    def __init__(self, value, is_dir = True):
        self.value = value
        self.size = 0
        self.is_dir = is_dir
        self.children = []
        self.parent = None

    def insert(self, value, is_dir = True):
        new_node = Node(value, is_dir)
        new_node.parent = self
        self.children.append(new_node)
        return new_node
    
    def update_size(self, size):
        self.size += int(size)
        if self.parent is not None:
            self.parent.update_size(size)

    def print_size(self):
        if self.is_dir:
            print(self.value, self.size)
            for child in self.children:
                child.print_size()
    
    def get_sum_of_small_subdirs(self):
        if not self.is_dir:
            return 0
        sum_size = self.size if self.size <= 100000 else 0
        for child in self.children:
            sum_size += child.get_sum_of_small_subdirs()
        return sum_size
    
    def get_sizes(self):
        sizes = []
        if not self.is_dir:
            return sizes
        sizes.append(self.size)
        for child in self.children:
            sizes += child.get_sizes()
        return sizes
    
    def get_smallest_valid_dir(self):
        sizes = self.get_sizes()
        required = sizes[0] - 40000000
        return sorted([x for x in self.get_sizes() if x >= required])[0]
    
tree = Node('/')
current_node = tree

# Open the file
with open('input.txt', 'r') as f:
    # Iterate over the file object line by line
    for l in f:
        line = l.strip()
        if line.startswith('$'):
            cmd = line.split(' ')[1:]
            if cmd[0] == 'cd':
                if cmd[1] == '/':
                    current_node = tree
                if cmd[1] == '..':
                    current_node = current_node.parent
                else:
                    current_node = current_node.insert(cmd[1])
        else:
            if not line.startswith('dir'):
                [ size, name ] = line.split(' ')
                new_node = current_node.insert(name, False)
                new_node.update_size(size)

print(tree.get_sum_of_small_subdirs())
print(tree.get_smallest_valid_dir())