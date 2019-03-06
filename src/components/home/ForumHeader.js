import React from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import chroma from 'chroma-js';
import { changeSearchTerm, changeCategoryFilter } from '../../actions/posts'
import './forum-header.scss';

export class ForumHeader extends React.Component{
  componentDidMount(){
    this.search.focus();
  }

  componentDidUpdate(prevProps){
    this.search.focus();
  }
  
  whichForum(){
    return (
      this.props.type === "neighbors" ? 
      <h1>Happening In Your Neighborhood</h1> : 
      <h1>Happening In Your City</h1>
    );
  }

  render(){
    const filterOptions = [
      {value: "", label:"Select Filter:", color: "#ccc"},
      {value: "Crime", label: "Crime", color: '#e36060'},
      {value: "Personal", label: "Personal", color: '#47b5c6'},
      {value: "Event", label: "Event", color: '#c093d7'},
      {value: "Other", label: "Other", color: '#f3c59c'}
    ];

    const dot = (color = '#ccc') => ({
      alignItems: 'center',
      display: 'flex',
    
      ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
      },
    });

    const colorStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white',  borderColor: 'black', boxShadow: 'none', }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
          color: isDisabled
            ? '#ccc'
            : isSelected
              ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
              : data.color,
          cursor: isDisabled ? 'not-allowed' : 'default',
          fontFamily: 'Open Sans',
          fontSize: '15px',
        };
      },
      input: styles => ({ ...styles, ...dot(), fontFamily: 'Open Sans', fontSize: '15px', }),
      placeholder: styles => ({ ...styles, ...dot(), fontFamily: 'Open Sans', fontSize: '15px', }),
      singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    };

    return(
      <header className="forum-header">

        {this.whichForum()}
        <div>
        <i className="fas fa-search"></i>

        <input 
          ref={input=>this.search=input}
          type="text" 
          onChange={e=>this.props.dispatch(changeSearchTerm(e.target.value))} 
          className="search" 
          placeholder={`Search ${this.props.type==="neighbors" ? "Neighborhood" : "City"} Forum`}/> 

      </div>
        <Select
          defaultValue={filterOptions[0]} 
          options={filterOptions} 
          placeholder="Select Filter" 
          className="filter-posts" 
          onChange={option => this.props.dispatch(changeCategoryFilter(option.value))}
          styles={colorStyles}
        />
        
      </header>
    );
  }
}

const mapStateToProps = state => ({
  focusOn: state.nav.focus,
});

export default connect(mapStateToProps)(ForumHeader)
