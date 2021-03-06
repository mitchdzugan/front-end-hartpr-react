import React, { Component } from "react";
import axios from 'axios';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Head2HeadSetsTable from './Head2HeadSetsTable';
import Head2HeadStats from './Head2HeadStats';

class Head2Head extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            player1Id: null,
            player2Id: null,
            sets: [],
            stats: {}
        }
        this.submit = this.submit.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.getHead2HeadFromApi = this.getHead2HeadFromApi.bind(this);
        this.calculateStatsForHead2Head = this.calculateStatsForHead2Head.bind(this);
    }

    componentDidMount() {
        const url = `http://hartpr20180601085617.azurewebsites.net/api/players/${this.props.match.params.game}/?OrderBy=tag&pageNumber=1&pageSize=1500`
        axios.get(url)
            .then((response) => {
                this.setState({
                    players: response.data.value
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    calculateStatsForHead2Head(player1Id, player2Id, sets) {
        var player1SetWins = 0;
        var player2SetWins = 0;
        var player1GameWins = 0;
        var player2GameWins = 0;
        var player1Tag;
        var player2Tag;
        for (var idx=0; idx<sets.length; idx++) {
            if (player1Id === sets[idx]["winnerId"]) {
                player1SetWins++;
                player1GameWins += sets[idx]["winnerScore"]
                player2GameWins += sets[idx]["loserScore"]
            } else {
                player2SetWins++;
                player2GameWins += sets[idx]["winnerScore"]
                player1GameWins += sets[idx]["loserScore"]
            }
        }
        if (sets.length > 0) {
            player1Tag = player1Id === sets[0]["winnerId"] ? sets[0]["winner"] : sets[0]["loser"] 
            player2Tag = player2Id === sets[0]["winnerId"] ? sets[0]["winner"] : sets[0]["loser"] 
        }
        return {
            player1SetWins: player1SetWins,
            player2SetWins: player2SetWins,
            player1GameWins: player1GameWins,
            player2GameWins: player2GameWins,
            player1Tag: player1Tag,
            player2Tag: player2Tag
        }
    }

    getHead2HeadFromApi() {
        //TODO: Where do I do something if the result is null aka they've never played, what component do I render and how?
        var player1Id = this.state.player1Id;
        var player2Id = this.state.player2Id;
        const h2hUrl = `http://hartpr20180601085617.azurewebsites.net/api/players/${this.props.match.params.game}/head2head/${player1Id}/${player2Id}`

        axios.get(h2hUrl)
            .then((response) => {
                this.setState({
                    sets: response.data,
                    stats: this.calculateStatsForHead2Head(player1Id, player2Id, response.data)
                })
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(h2hUrl)
    }

    submit(e) {
        e.preventDefault();
        this.getHead2HeadFromApi()
        console.log(this.state.sets)
        console.log(this.state.players.length)
    }

    handleChange1(e) {
        var playerId = e.target.value
        console.log(e.target.value)
        this.setState({
            player1Id: playerId
        })
    }

    handleChange2(e) {
        var playerId = e.target.value
        console.log(e.target.value)
        this.setState({
            player2Id: playerId
        })
    }


    render() {
        return (
        <div>
            <form onSubmit={this.submit} className="form-group">
            <h1>See the Head2Head matchup for any two players!</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <label htmlFor="player1">Player 1</label>
                        <select
                            name="player1"
                            className="form-control form-control-lg"
                            value={this.state.player1Id}
                            onChange={this.handleChange1}
                            >
                            {this.state.players.map((player, i) => (
                                <option key={i} value={player.id}>{player.tag}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="player2">Player 2</label>
                        <select
                            className="form-control form-control-lg"
                            value={this.state.player2Id}
                            onChange={this.handleChange2}
                            >
                            {this.state.players.map((player, i) => (
                                <option key={i} value={player.id}>{player.tag}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <br />
                <button className="btn btn-primary mb-2 btn-lg btn-block" disabled={!this.state.players.length === 0}>Let's Ride!</button>
            </form>
            <div>
                <Head2HeadStats stats={this.state.stats}/>
                <Head2HeadSetsTable sets={this.state.sets} game={this.props.match.params.game}/>
            </div>
        </div>

    )
    }
}

export default Head2Head;
