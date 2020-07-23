import React, { Component } from "react";

import "./App.css";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
class App extends Component {
  state = {};

  componentDidMount() {
    this.loadMore(1);
    this.loadMore(2);
    this.loadMore(3);
  }

  composeProducts(data) {
    let products = data;
    if (this.state.products) {
      products = products.concat(this.state.products);
    }
    this.setState({ products }, () => this.sortProducts(this.state.products));
  }

  filterList(event) {
    const { fetchedSortedProducts } = this.state;
    const sortedProducts = fetchedSortedProducts.filter(function (item) {
      return (
        item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      );
    });
    this.setState({ sortedProducts });
  }

  sortProducts(data = []) {
    const temp = [],
      result = [];
    data.forEach((item) => {
      if (temp[item.id])
        temp[item.id].price += parseFloat(item.unitPrice * item.sold);
      else
        temp[item.id] = {
          name: item.name,
          price: parseFloat(item.unitPrice * item.sold),
        };
    });

    for (const key in temp) {
      result.push({
        name: temp[key].name,
        price: temp[key].price,
        id: key,
      });
    }
    const sortedResults = result.sort((a, b) =>
      a.name === b.name ? 0 : +(a.name > b.name) || -1
    );
    this.setState({
      sortedProducts: sortedResults,
      fetchedSortedProducts: sortedResults,
    });
  }

  loadMore(number) {
    const url = `api/branch${number}.json`;
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        res && this.composeProducts(res.products);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { sortedProducts, fetchedSortedProducts } = this.state;

    return (
      <div class="product-list">
        <div>
          <label for="search" class="inline-label">
            Search Products
          </label>
          <input
            type="text"
            onChange={this.filterList.bind(this)}
            placeholder="Search"
            id="search"
          />
        </div>
        {!fetchedSortedProducts && <div id="loading">Loading...</div>}
        {fetchedSortedProducts && (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts &&
                sortedProducts.map((product) => (
                  <tr key={product.name} othe={product.name}>
                    <td>{product.name}</td>
                    <td>{formatNumber(product.price)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>
                  {sortedProducts &&
                    formatNumber(
                      sortedProducts.reduce(
                        (final, data) => final + parseFloat(data.price),
                        0
                      )
                    )}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    );
  }
}

export default App;
