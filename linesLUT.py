import sys

levels = 5*2+1 # five horizontal, five vertical, max size: 33x33
restart = '65535'
start = '[\n'
line_start = '\t'
line_close = ',\n'
close = '],\n'

row = [[0, 1], [2, 3]]
col = [[0, 2], [1, 3]]

idx = 4
for i in range(levels):
    sys.stdout.write(start)
    for line in row:
        sys.stdout.write(line_start)
        for value in line:
            sys.stdout.write('%4d, ' % value)
        sys.stdout.write(restart + line_close)
    for line in col:
        sys.stdout.write(line_start)
        for value in line:
            sys.stdout.write('%4d, ' % value)
        sys.stdout.write(restart + line_close)
    sys.stdout.write(close)
    
    num  = 1 << (i >> 1)
    size = (1 << ((i + 1) >> 1)) + 1
    if i & 1 == 0:
        for j in range(num):
            c = []
            for k in range(size):
                row[k].insert(j*2+1, idx)
                c += [idx]
                idx += 1
            col.insert(j*2 + 1, c)
    else:
        for j in range(num):
            c = []
            for k in range(size):
                col[k].insert(j*2+1, idx)
                c += [idx]
                idx += 1
            row.insert(j*2 + 1, c)
