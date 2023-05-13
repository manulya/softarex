import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Navbar(props) {
  const [isScrolled, setIsScrolled] = useState(props.scrolled);
  const [inputValue, setInputValue] = useState('');
 
  const navigate = useNavigate()
  
  const handleSearch = () => {
    const query = inputValue; 
    navigate(`/category?query=${query}`);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); 
    handleSearch();
  };
  
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSubmit(event);
      }
    };

    useEffect(() => {
      if (!props.scrolled) {
        const handleScroll = () => {
          if (window.scrollY > 500) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        };
  
        window.addEventListener("scroll", handleScroll);
  
        return () => window.removeEventListener("scroll", handleScroll);
      }
    }, [props.scrolled]);
  

  return (
    <NavbarContainer isScrolled={isScrolled}>
<CustomNavlink to="/">{isScrolled?(<Logo src="https://images.pexels.com/lib/api/pexels.png" />):(<Logo src="https://images.pexels.com/lib/api/pexels-white.png"/>)} </CustomNavlink>
      <SearchContainer isScrolled={isScrolled} placeholder="Search" onSubmit={handleSubmit}>
        <SearchInput id="search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}/>
        <SearchButton onClick={handleSubmit}  type="submit" ><SvgIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path d="M21.707 20.293l-5.5-5.5a8 8 0 1 0-1.414 1.414l5.5 5.5a1 1 0 0 0 1.414-1.414zM4 10a6 6 0 1 1 6 6 6.007 6.007 0 0 1-6-6z" />
                  </SvgIcon></SearchButton>
      </SearchContainer>
    </NavbarContainer>
  );
}

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => (props.isScrolled ? "#fff" : "transparent")};
  box-shadow: ${(props) =>
    props.isScrolled ? "0 1px 0 #f7f7f7" : "none"};
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;
  height: 80px;
  transition: background 0.2s ease, box-shadow 0.2s ease;
`;
const CustomNavlink=styled(NavLink)`
text-decoration: none;
color:black;
&:hover {
    color: #333;
  }
`
const Logo = styled.img`
position:relative;
width: 130px;
left:40px;
  `

const SearchContainer = styled.form`
   display: ${(props) => (props.isScrolled ? "flex" : "none")};
  position: absolute;
  left: 180px;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 220px);
  height: 40px;
  border-radius: 20px;
  padding-right: 100px;
  background-color: #f7f7f7;
  transition: background-color 0.2s ease;
  &:focus-within {
    border: 1px solid #dfdfe0;
    background: #fff;
  }
`;

const SearchInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: calc(100% - 90px);
  padding: 10px 20px;
  color: #7f7f7f;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
    border-right: 1px solid #dfdfe0;;
  }

  &::placeholder {
    color: #ccc;
    border-right: 1px solid #dfdfe0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    -webkit-appearance: none;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 60px;
  font-family: inherit;
  font-size: 16px;
  font-weight: bold;
  color: #7f7f7f;
  border: none;
  background-color: transparent;
  cursor: pointer;

  &:focus {
    
    border-left:1px solid #08087d;
  }
`;
const SvgIcon = styled.svg`
  path {
    fill: #7f7f7f; 
  }
  
  &:hover path {
    fill: #05a081; 
  }
`;
