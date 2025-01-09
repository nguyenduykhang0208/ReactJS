import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import "./SearchControl.scss"
class SearchControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            showSearchInfo: false
        };
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (prevProps.keyword !== this.props.keyword) {
            this.setState({
                keyword: this.props.keyword,
                showSearchInfo: true
            });
        }
    }

    onHandleChange = (event) => {
        const newKeyword = event.target.value;
        this.setState({
            keyword: newKeyword
        });

        if (newKeyword === "") {
            this.onClearSearch();
        }
    };

    onSearch = e => {
        e.preventDefault();
        this.props.onSearch(this.state.keyword);
    };

    onClearSearch = () => {
        this.props.onSearch("");
        this.setState({
            keyword: "",
            showSearchInfo: false
        });
    };

    render() {
        return (
            <div className="box_search">
                <form onSubmit={this.onSearch}>
                    <div className="search_wrp">
                        <div className="input-group">
                            <input
                                type="text"
                                name="keyword"
                                className="search-input"
                                value={this.state.keyword}
                                onChange={this.onHandleChange}
                            />
                            <button
                                type="button"
                                className="btn btn-default btn_clear"
                                onClick={this.onClearSearch}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="btn-group">
                            <span>
                                <button
                                    className="btn btn-primary btn-search"
                                    type="button"
                                    onClick={this.onSearch}
                                >
                                    <i className="fa fa-search mr-5" />
                                    <FormattedMessage id="searchControl.search" />
                                </button>
                            </span>
                        </div>

                    </div>
                    <div className={!this.state.showSearchInfo ? "hidden" : ""}>
                        <FormattedMessage id="searchControl.searchInfo" /> "<strong>{this.state.keyword}</strong>"
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchControl;
