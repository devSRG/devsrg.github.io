document.addEventListener('DOMContentLoaded', onload);
    
function onload() {
    let sudoku, cells, userInput;
    let iter = 0, MAX_ITERATIONS = 10;

    sudoku = new Sudoku();
    cells = document.getElementsByClassName('cell');
    userInput = sudoku.copyGrid(sudoku.grid);

    while (!sudoku.solution.length && iter < MAX_ITERATIONS) {
        sudoku.generate();
        iter++;
    }

    console.log(sudoku.solution)

    Array.from(cells).forEach(cell => cell.addEventListener('click', editContent));
    document.getElementsByClassName('theme')[0].addEventListener('click', toggleTheme);
    document.getElementsByClassName('reset')[0].addEventListener('click', resetGame);
    document.getElementsByClassName('new-game')[0].addEventListener('click', newGame);

    updateGrid();

    function toggleTheme() {
        let body = document.getElementsByTagName('body')[0];
        let hasDarkMode = body.classList.contains('dark-mode');

        if (hasDarkMode) {
            body.classList.remove('dark-mode');
        } else {
            body.classList.add('dark-mode');
        }
    }

    function editContent(e) {
        let cell = e.target;
        
        if (!cell.dataset.default && !cell.children.length) {
            let input = document.createElement('input');
        
            input.type = 'number';
            input.value = cell.innerText;
            input.max = 9;
            input.addEventListener('blur', removeInput);
            cell.appendChild(input);
            input.focus();
        }
    }

    function updateCell(e) {
        let cell = e.target.parentNode;
        let input = e.target;

        cell.innerText = input.value;

        if (input.value != '') {
            highlightConflicts(parseInt(input.value), parseInt(cell.dataset.row), parseInt(cell.dataset.col));
        } else {
            removeHighlightedConflicts();   
        }

        userInput[cell.dataset.row][cell.dataset.col] = parseInt(input.value) || 0;

        if (isGridFilled()) {
            if (sudoku.isValidGrid(userInput) && sudoku.validateSolution(userInput)) {
                showComplete();
            }
        }
    }

    function isGridFilled() {
        return userInput.every((arr) => !arr.includes(0));
    }

    function showComplete() {
        document.getElementsByClassName('complete')[0].classList.add('show');
        document.getElementsByClassName('reset')[0].setAttribute('disabled', true);
    }

    function hideComplete() {
        document.getElementsByClassName('complete')[0].classList.remove('show');
        document.getElementsByClassName('reset')[0].removeAttribute('disabled');
    }

    function removeInput(e) {
        let input = e.target;

        if (input) {
            updateCell(e);
            input.remove();
        }
    }

    function highlightConflicts(value, row, col) {
        removeHighlightedConflicts();

        sudoku.checkForConflicts(value, row, col, userInput).forEach(conflict => {
            let cell = cells[((conflict.row % 3) * 3 + ~~(conflict.row / 3) * 27) + ((conflict.col % 3) + ~~(conflict.col / 3) * 9)];

            if (cell) {
                cell.classList.add('highlight');
            }
        });
    }

    function removeHighlightedConflicts() {
        Array.from(cells).forEach(cell => cell.classList.remove('highlight'));
    }

    function updateGrid() {
        let gridRow = 0;
        let gridCol = 0;

        for (let i = 0; i < 9; i++) {
            let box = sudoku.getGridBox(gridRow, gridCol);

            if (box.length) {
                for (let j = 0; j < box.length; j++) {
                    let cell = cells[j + 9 * i];
                    if (box[j]) {
                        cell.innerText = box[j];
                        cell.dataset.default = 'true';
                        cell.classList.add('default');
                    } else {
                        cell.innerText = "";
                        cell.dataset = null;
                        cell.classList.remove('default');
                    }
                }
            }

            if (i && ((i + 1) % 3) == 0) {
                gridRow += 3;
                gridCol = 0;
            } else {
                gridCol += 3;
            }
        }

        removeHighlightedConflicts();
    }

    function resetGame() {
        updateGrid();
    }

    function newGame() {
        hideComplete();
        sudoku.generate();
        updateGrid();
    }
}
