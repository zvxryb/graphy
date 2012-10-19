import sys

levels = 5*2+1 # five horizontal, five vertical, max size: 33x33
restart = '65535'
start = '[\n'
line_start = '\t'
line_close = ',\n'
close = '],\n'

grid = [[0, 1], [2, 3]]

idx = 4
for i in range(levels):
    sys.stdout.write(start)
    for j in range(len(grid)-1):
        row = grid[j]
        sys.stdout.write(line_start)
        for k in range(len(row)):
            sys.stdout.write('%4d, ' % grid[j][k])
            sys.stdout.write('%4d, ' % grid[j+1][k])
        sys.stdout.write(restart + line_close)
    sys.stdout.write(close)
    
    num  = 1 << (i >> 1)
    size = (1 << ((i + 1) >> 1)) + 1
    if i & 1 == 0:
        for j in range(num):
            for k in range(size):
                grid[k].insert(j*2+1, idx)
                idx += 1
    else:
        for j in range(num):
            c = []
            for k in range(size):
                c += [idx]
                idx += 1
            grid.insert(j*2 + 1, c)
