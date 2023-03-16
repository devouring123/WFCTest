const tiles = [];
const tileImages = [];

let grid = [];

const DIM = 20;

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const RSEED = 10;
const CANVASSIZE = 1200;

function preload() {
    // path = "tiles";
    // tileImages[0] = loadImage(`${path}/blank.png`);
    // tileImages[1] = loadImage(`${path}/up.png`);

    // circuit Tile
    // path = "circuits";
    // for (let i = 0; i < 13; i++) {
    //     tileImages[i] = loadImage(`${path}/${i}.png`);
    // }

    //
    path = "NewTiles";
    for (let i = 0; i < 9; i++) {
        tileImages[i] = loadImage(`${path}/${i}.png`);
    }
}

function setup() {
    // 랜덤 시드
    // randomSeed(RSEED);

    // canvas 생성
    createCanvas(CANVASSIZE, CANVASSIZE);

    // Loaded and created the tiles
    // circuitTiles
    // tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
    // tiles[1] = new Tile(tileImages[1], ['BBB', 'BBB', 'BBB', 'BBB']);
    // tiles[2] = new Tile(tileImages[2], ['BBB', 'BCB', 'BBB', 'BBB']);
    // tiles[3] = new Tile(tileImages[3], ['BBB', 'BDB', 'BBB', 'BDB']);
    // tiles[4] = new Tile(tileImages[4], ['ABB', 'BCB', 'BBA', 'AAA']);
    // tiles[5] = new Tile(tileImages[5], ['ABB', 'BBB', 'BBB', 'BBA']);
    // tiles[6] = new Tile(tileImages[6], ['BBB', 'BCB', 'BBB', 'BCB']);
    // tiles[7] = new Tile(tileImages[7], ['BDB', 'BCB', 'BDB', 'BCB']);
    // tiles[8] = new Tile(tileImages[8], ['BDB', 'BBB', 'BCB', 'BBB']);
    // tiles[9] = new Tile(tileImages[9], ['BCB', 'BCB', 'BBB', 'BCB']);
    // tiles[10] = new Tile(tileImages[10], ['BCB', 'BCB', 'BCB', 'BCB']);
    // tiles[11] = new Tile(tileImages[11], ['BCB', 'BCB', 'BBB', 'BBB']);
    // tiles[12] = new Tile(tileImages[12], ['BBB', 'BCB', 'BBB', 'BCB']);
    // for (let i = 2; i < 14; i++) {
    //     for (let j = 1; j < 4; j++) {
    //         tiles.push(tiles[i].rotate(j));
    //     }
    // }

    // NewTiles
    tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
    tiles[1] = new Tile(tileImages[1], ['AAA', 'ABA', 'AAA', 'AAA']);
    tiles[2] = new Tile(tileImages[2], ['AAA', 'ABA', 'AAA', 'ABA']);
    tiles[3] = new Tile(tileImages[3], ['ABA', 'ABA', 'AAA', 'AAA']);
    tiles[4] = new Tile(tileImages[4], ['AAA', 'ABA', 'ABA', 'ABA']);
    tiles[5] = new Tile(tileImages[5], ['ABA', 'ABA', 'ABA', 'ABA']);
    tiles[6] = new Tile(tileImages[6], ['CCC', 'CCC', 'CCC', 'CCC']);
    tiles[7] = new Tile(tileImages[7], ['ACC', 'CCC', 'CCA', 'AAA']);
    tiles[8] = new Tile(tileImages[8], ['ACC', 'CCA', 'AAA', 'AAA']);
    for (let i = 1; i < 9; i++) {
        if(i === 6)
            continue;
        for (let j = 1; j < 4; j++) {
            tiles.push(tiles[i].rotate(j));
        }
    }


    // Generate the adjacency rules based on edges
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        tile.analyze(tiles);
    }

    startOver();
}

function startOver() {
    background(128);
    // Create cell for each spot on the grid
    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = new Cell(tiles.length);
        grid[i].setPos(parseInt(i % DIM), parseInt(i / DIM));
    }
}

function checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
        // VALID: [BLANK, RIGHT]
        // ARR : [BLANK, UP, RIGHT, DOWN, LEFT]
        // result in removing UP, DOWN, LEFT
        let element = arr[i];
        if (!valid.includes(element)) {
            arr.splice(i, 1);
        }
    }
}

function draw() {

    //Pick cell with least entropy
    let gridCopy = grid.slice();
    gridCopy = gridCopy.filter((a) => !a.collapsed);
    gridCopy.sort(((a, b) => {
        return a.options.length - b.options.length;
    }));

    if (gridCopy.length === 0) {
        return;
    }

    let len = gridCopy[0].options.length;
    let stopIndex = 0;
    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i;
            break;
        }
    }
    if (stopIndex > 0) gridCopy.splice(stopIndex);

    // 기본 코드
    const cell = random(gridCopy);
    cell.collapsed = true;
    const pick = random(cell.options);
    if (pick === undefined) {
        startOver();
        return;
    }
    cell.options = [pick];

    const w = width / DIM;
    const h = height / DIM;
    // cell이 픽됐으므로 바로 그리면 됨.
    image(tiles[cell.options[0]].img, cell.pos[0] * w, cell.pos[1] * h, w, h);

    // for (let j = 0; j < DIM; j++) {
    //     for (let i = 0; i < DIM; i++) {
    //         let cell = grid[i + DIM * j];
    //         // 붕괴한건 그대로 그리기
    //         // 근데 한번 그리면 안바뀌는 p5특성상 붕괴할때 딱 한번 그리는 거로 하는게 더 나을 듯
    //         if (cell.collapsed) {
    //             let index = cell.options[0];
    //             // 실제로 그리는 함수
    //             image(tiles[index].img, i * w, j * h, w, h);
    //         }
    //         // 아닌 부분 그리기
    //         // else {
    //         //     fill(0);
    //         //     stroke(255);
    //         //     rect(i * w, j * h, w, h);
    //         // }
    //     }
    // }

    // 다음번 그리드 갱신하는 함수
    const nextGrid = [];
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let index = i + j * DIM;
            if (grid[index].collapsed) {
                nextGrid[index] = grid[index];
            } else {
                let options = new Array(tiles.length).fill(0).map((x, i) => i);
                // LOOK UP
                if (j > 0) {
                    let up = grid[i + (j - 1) * DIM];
                    let validOptions = [];
                    for (let option of up.options) {
                        let valid = tiles[option].down;
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // LOOK RIGHT
                if (i < DIM - 1) {
                    let right = grid[i + 1 + j * DIM];
                    let validOptions = [];
                    for (let option of right.options) {
                        let valid = tiles[option].left;
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // LOOK DOWN
                if (j < DIM - 1) {
                    let down = grid[i + (j + 1) * DIM];
                    let validOptions = [];
                    for (let option of down.options) {
                        let valid = tiles[option].up;
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // LOOK LEFT
                if (i > 0) {
                    let left = grid[i - 1 + j * DIM];
                    let validOptions = [];
                    for (let option of left.options) {
                        let valid = tiles[option].right;
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                nextGrid[index] = new Cell(options);
                // 각각의 셀이 자신의 인덱스를 포함함, 예전 자신의 위치를 가져오면 그걸 넣는것도 좋다.
                nextGrid[index].setPos(parseInt(index % DIM), parseInt(index / DIM));
            }
        }
    }
    grid = nextGrid;
}

// function mousePressed() {
//     redraw();
// }
