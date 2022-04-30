import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

function getGameStatus(boxes) {
    let winCombs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < winCombs.length; i++) {
        let winComb = winCombs[i];

        let p1 = winComb[0];
        let p2 = winComb[1];
        let p3 = winComb[2];

        if (boxes[p1] != null && boxes[p1] == boxes[p2] && boxes[p2] == boxes[p3]) {
            return boxes[p1];
        }
    }

    return null;
}

class Board extends React.Component {
    handleBoxClicks(i) {
        this.props.handlerForBoxClicks(i);
    }

    renderBoxes(i) {
        return (
            <button onClick={() => this.handleBoxClicks(i)}>
                {this.props.boxes[i] == null ? "" : this.props.boxes[i]}</button>
        );
    }

    render() {
        return (
            <>
                <div className="board">
                    <div className="title">Tic Tac Toe</div>
                    <div className="content">
                        <div className="playBoard">
                            <div className="row">
                                {this.renderBoxes(0)}
                                {this.renderBoxes(1)}
                                {this.renderBoxes(2)}
                            </div>
                            <div className="row">
                                {this.renderBoxes(3)}
                                {this.renderBoxes(4)}
                                {this.renderBoxes(5)}
                            </div>
                            <div className="row">
                                {this.renderBoxes(6)}
                                {this.renderBoxes(7)}
                                {this.renderBoxes(8)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

class History extends React.Component {
    moveHistory(i) {
        this.props.handlerForHistory(i);
    }

    render() {
        let gameTitle;

        if (this.props.gameStatus == null) {
            gameTitle = "Next move for " + (this.props.moveNumber % 2 == 0 ? "X" : "O");
        } else {
            if (this.props.gameStatus == "draw") {
                gameTitle = "It's a draw!";
            } else {
                gameTitle = this.props.gameStatus + " wins!";
            }
        }

        let buttons = [];
        for (let i = 0; i <= this.props.moveNumber; i++) {
            let button;

            if (i == 0) {
                button = (<button key={i} onClick={() => this.moveHistory(i)}>Go to start!</button>);
            } else {
                button = (<button key={i} onClick={() => this.moveHistory(i)}>Go to step no. {i}</button>);
            }

            buttons.push(button);
        }

        return (
            <>
                <div className="display">
                    <div className="title">{gameTitle}</div>
                    <div className="content">
                        <div className="history">{buttons}</div>
                    </div>
                </div>
            </>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [
                [null, null, null, null, null, null, null, null, null]
            ],
            moveNumber: 0,
            gameStatus: null
        }
    }

    handleBoxClicks(i) {
        let oldHistory = this.state.history.slice();
        let currentBoxes = oldHistory[oldHistory.length - 1].slice();

        if (currentBoxes[i] != null || this.state.gameStatus != null) {
            return;
        }

        currentBoxes[i] = (this.state.moveNumber % 2 == 0 ? "X" : "O");
        oldHistory.push(currentBoxes);

        let newGameStatus = getGameStatus(currentBoxes);
        if (this.state.moveNumber == 8 && newGameStatus == null) {
            newGameStatus = "Draw";
        }

        this.setState(
            {
                history: oldHistory,
                moveNumber: this.state.moveNumber + 1,
                gameStatus: newGameStatus
            }
        );
    }

    moveToStep(i) {
        let oldHistory = this.state.history.slice(0, i + 1);
        let currentBoxes = oldHistory[oldHistory.length - 1];
        let newGameStatus = getGameStatus(currentBoxes);

        this.setState(
            {
                history: oldHistory,
                moveNumber: i,
                gameStatus: newGameStatus
            }
        );
    }

    render() {
        let boxes = this.state.history[this.state.history.length - 1];

        return (
            <>
                <Board handlerForBoxClicks={(i) => this.handleBoxClicks(i)} boxes={boxes} />
                <History moveNumber={this.state.moveNumber} gameStatus={this.state.gameStatus}
                    handlerForHistory={(i) => this.moveToStep(i)} />
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));