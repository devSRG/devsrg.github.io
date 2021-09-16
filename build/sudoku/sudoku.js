class Sudoku {
    constructor() {
        this.grid = [];
        this.solution = [];
        this.count = 0;
        this.generate();
    }
    
    generate() {
        this.solution = [];
        this.count = 0;
        this.grid = this.createGrid(0);
        this.randomizeGrid(18);
        this.solve();
        console.log('Grid:', this.grid, '\n')
    }

    solve() {
        this.findSolution(this.copyGrid(this.grid));
    }

    findSolution(solution, row = 0, col = 0) {
        this.count++;
        if (this.count >= 200000) { // ~200ms
            console.log('Iterations exceeded', this.count);
            return;
        }
        if (row == 9) {
            if (this.isValidGrid(solution)) {
                console.log('Valid solution', this.count)
                this.solution = this.copyGrid(solution);
                return;
            } else {
                console.log('Wrong solution');
                return;
            }
        } else if (this.grid[row][col] != 0) {
            let adjRow, adjCol;

            if (col == 9 - 1) {
                adjRow = row + 1;
                adjCol = 0;
            } else {
                adjRow = row;
                adjCol = col + 1;
            }

            this.findSolution(solution, adjRow, adjCol);
        } else {
            let validOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9], candidates = [];
            let adjRow, adjCol;

            for (var i = 0; i < validOptions.length; i++) {
                if (this.isValidInsertion(row, col, validOptions[i], solution)) {
                    candidates.push(validOptions[i]);
                }
            }
            
            if (!this.solution.length) {
                for (var j = 0; j < candidates.length; j++) {
                    solution[row][col] = candidates[j];

                    if (col == 8) {
                        adjRow = row + 1;
                        adjCol = 0;
                    } else {
                        adjRow = row;
                        adjCol = col + 1;
                    }

                    this.findSolution(solution, adjRow, adjCol);

                    // reset solution to previous
                    solution[row][col] = 0;
                }
            }
        }
    }

    isValidGrid(solution) {
        return this.validateGridRows(solution) &&
                this.validateGridColumns(solution) &&
                this.validateGridBoxes(solution);
    }

    validateGridRows(solution) {
        return solution.every(arr => {
            let row = new Set(arr);
            
            row.delete(0);

            return row.size == 9;
        });
    }

    validateGridColumns(solution) {
        for (let i = 0; i < 9; i++) {
            let col = new Set(this.getGridColumn(i, solution));

            col.delete(0);

            if (col.size < 9) {
                return false;
            }
        }

        return true;
    }

    validateGridBoxes(solution) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {  
                let box = new Set(this.getGridBox(i * 3, j * 3, solution));

                box.delete(0);

                if (box.size < 9) {
                    return false;
                }
            }
        }

        return true;
    }

    isValidInsertion(row, col, value, grid) {
        return !this.getGridRow(row, grid).includes(value) &&
            !this.getGridColumn(col, grid).includes(value) &&
            !this.getGridBox(row, col, grid).includes(value);
    }

    getGridRow(row, grid) {
        return grid ? grid[row]: this.grid[row];
    }

    getGridColumn(col, grid) {
        let gridColumn = [];

        for (let i = 0; i < 9; i++) {
            gridColumn.push(grid ? grid[i][col]: this.grid[i][col]);
        }

        return gridColumn;
    }

    getGridBox(row, col, grid) {
        let box = [];
        let gridRow = row - row % 3;
        let gridCol = col - col % 3;

        grid = grid ? grid: this.grid;

        for (let i = 0; i < 9; i++) {
            if (grid[gridRow] !== undefined && grid[gridRow][gridCol + i % 3] !== undefined) {
                box.push(grid[gridRow][gridCol + i % 3]);
            }
            
            if (i && (i + 1) % 3 == 0) gridRow++;
        }

        return box;
    }

    createGrid(defaultValue) {
        let grid = new Array(9);

        for (let i = 0; i < 9; i++) {
            grid[i] = new Array(9);
            
            if (defaultValue != undefined) {
                grid[i].fill(defaultValue);
            }
        }

        return grid;
    }

    checkForConflicts(value, row, col, grid) {
        let conflicts = [];

        this.getGridRow(row, grid).map((num, index) => {
            if (num == value && index != col) {
                conflicts.push({row, col: index});
            }
        });
        this.getGridColumn(col, grid).map((num, index) => {
            if (num == value && index != row) {
                conflicts.push({row: index, col});
            }
        });
        this.getGridBox(row, col, grid).map((num, index) => {
            if (num == value && !(~~(index / 3) == row % 3 && (index - ~~(index / 3) * 3) == col % 3)) {
                conflicts.push({row: ~~(row / 3) * 3 + ~~(index / 3), col: ~~(col / 3) * 3 + (index % 3)});
            }
        });

        conflicts.length && conflicts.push({row, col});

        return conflicts;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomizeGrid(count) {
        let SUB_GRID_MAX_RND = 3;
        let MAX_ITERATIONS = 50;
        let randomGridValue = () => {
            return {
                row: this.getRandomInt(0, 8),
                col: this.getRandomInt(0, 8),
                value: this.getRandomInt(1, 9)
            };
        };
        let randomFillGrid = () => {
            let {row, col, value} = randomGridValue();

            if (this.getGridBox(row, col).filter(val => val > 0).length < SUB_GRID_MAX_RND && this.isValidInsertion(row, col, value)) {
                this.grid[row][col] = value;

                return true;
            } else {
                return false;
            }
        };
        let c3 = 0;
        for (var i = 0; i < count; i++) {
            let c2 = 0;
            let filled = randomFillGrid();

            while (!filled && c2 != MAX_ITERATIONS) {
                c2++;
                filled = randomFillGrid();
            }

        }
    }

    copyGrid(grid) {
        let cpy = new Array(grid.length);
        grid.forEach((arr, i) => cpy[i] = arr.slice());

        return cpy;
    }
}
