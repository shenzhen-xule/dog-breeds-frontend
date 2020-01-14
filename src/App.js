import React from "react";
import $ from 'jquery';

require('./style.css');

class DogBreeds extends React.Component {
  constructor() {
    super();
    this.selectBreed = this.handleSelectBreed.bind(this);
    this.selectSubBreed = this.handleSelectSubBreed.bind(this);
    this.state = {
      allBreeds: [],        // all breeds got from backend without removed repeating breed
      breeds: [],           // breeds have removed repeating breed
      breed: '',            // selected breed by user
      subBreeds: [],        // all sub breeds of selected breed
      subBreed: '',         // selected sub breed
      imageUrls: [],        // image urls of the breed got from backend
    };
  }

  componentDidMount() {
    $.getJSON("http://127.0.0.1:9100/api/breeds/list/all", function(result) {
      if(result.code === 200) {
        let breeds = [];
        result.message.map(item => {
          if (breeds.indexOf(item.breed) === -1) {
            breeds.push(item.breed)
          }
        });
        this.setState({
          allBreeds: result.message,
          breeds: breeds
        });
      }
    }.bind(this));
  }

  handleSelectBreed(e) {
    e.preventDefault();
    const {allBreeds} = this.state;
    let optionDom = e.target.options[e.target.selectedIndex];
    let selectedBreed = allBreeds.filter(breed => breed.breed === optionDom.value);
    $.getJSON("http://127.0.0.1:9100/api/breed/images", {"breed": optionDom.value}, function(result) {
      if(result.code === 200) {
        this.setState({
          breed: optionDom.value,
          subBreeds: selectedBreed,
          imageUrls: result.message.slice(0, 2)
        });
      }
    }.bind(this));
  }

  handleSelectSubBreed(e) {
    e.preventDefault();
    const {breed} = this.state;
    let optionDom = e.target.options[e.target.selectedIndex];
    $.getJSON("http://127.0.0.1:9100/api/breed/images", {
      "breed": breed,
      "subbreed": optionDom.value
    }, function(result) {
      if(result.code === 200) {
        this.setState({
          subBreed: optionDom.value,
          imageUrls: result.message.slice(0, 2)
        });
      }
    }.bind(this));
  }

  render() {
    const {breeds, breed, subBreeds, imageUrls} = this.state;
    let Breeds = breeds,
      BreedsItem = function(X, i) {
        return <option key={i}>{X}</option>;
      };
    let SubBreeds, SubBreedsItem;
    if (breed) {
      SubBreeds = subBreeds;
      SubBreedsItem = function(X, i) {
        return <option key={i}>{X.subbreed}</option>;
      };
    }
    if (subBreeds.length > 1) {
      return (<div>
          <div id='selectBox'>
            <select id='selectStyle' onChange={this.selectBreed}>
              <option></option>
              {Breeds.map(BreedsItem)}</select>
            <select id='selectStyle' onChange={this.selectSubBreed}>
              <option></option>
              {SubBreeds.map(SubBreedsItem)}</select>

          </div>
          <div id='imageBox'>
            <img id='imageStyle' alt="" src={imageUrls[0]}/>
            <img id='imageStyle' alt="" src={imageUrls[1]}/>
          </div>
        </div>
      )
    } else {
      return (<div>
        <div id='selectBox'>
        <select id='selectStyle' onChange={this.selectBreed}>
          <option></option>
          {Breeds.map(BreedsItem)}</select>
        </div>
        <div id='imageBox'>
        <img id='imageStyle' alt="" src={imageUrls[0]}/>
        <img id='imageStyle' alt="" src={imageUrls[1]}/>
        </div>
      </div>)
    }
  }
}

export default DogBreeds;
