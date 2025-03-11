import React, { Component } from 'react'
import './Navbar.css'
import {useState} from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';



export default class Navbar extends Component {
    
    render() {
        return (
            
           
    
            <nav class="navbar">
                <div class="container-fluid">
                    <Link class="navbar-brand" to={this.props.link}><img className="image" src="/right.png" alt="" /></Link>
                    <h2 className="time-heading" style={{ textAlign: "center", fontWeight:700,marginBottom: "20px" }}>
          {this.props.cityname}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.time}</h2>
                    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasNavbarLabel"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/">Home</Link>
                                </li>
                                <li class="nav-item">
                                
                                    <Link class="nav-link active" to={`/weather/${this.props.cityname}/viewmap`}>Go To Map🗺️</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}
