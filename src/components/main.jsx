import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import search from "../img/search_icon.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { Photo } from "pexels";
import { createClient } from 'pexels';
import ImageGallery from "./ImageGallery";


const categories = [
    "Automotive",
    "Books",
    "Business",
    "Computers",
    "Electronics",
    "Fashion",
    "Health",
    "Home and Garden",
    "Industrial",
    "Movies",
    "Music",
    "Pet Supplies",
    "Sports",
    "Toys",
    "Travel",
    "Arts and Crafts",
    "Beauty",
    "Food",
    "Garden",
    "Jewelry",
    "Office Supplies",
    "Software",
    "Video Games",
    "Baby",
    "Cameras",
    "Cell Phones",
    "Education",
    "Gifts",
    "Hobbies",
    "Kitchen",
    "Outdoors",
    "Shoes",
    "Tools",
    "Watches",
    "Bags",
    "Collectibles",
    "DVD",
    "Health and Personal Care",
    "Kids and Family",
    "Musical Instruments",
    "Parts and Accessories",
  ];
  
  const client = createClient("563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf");
 
    
const Main=()=> {
    const [tendencies, setTendencies] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorURL, setAuthoURL] = useState('');
    const [currentTendency, setCurrentTendency] = useState('');
    const navigate = useNavigate();

  useEffect(() => {
    const randomTendencies = categories.slice(0).sort(() => Math.random() - 0.5).slice(0, 7);
    setTendencies(randomTendencies);
    setCurrentTendency(randomTendencies[0]);
  }, []);

  useEffect(() => {
    if (currentTendency) {
      client.photos.search({ query: currentTendency, per_page: 1 }).then(photos => {
        const photo = photos.photos[0];
        setImageUrl(photo.src.large2x);
        setAuthorName(photo.photographer);
        setAuthoURL(photo.photographer_url)
      });
    }
  }, [currentTendency]);
   
    const [inputValue, setInputValue] = useState('');
   
    const handleSearch = (tendency) => {
      const query = tendency || inputValue; 
      navigate(`/category?query=${query}`);
    };
    const handleSubmit = (event) => {
      event.preventDefault(); 
      handleSearch();
    };
    
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSubmit();
        }
      };
  return (
    <Wrapper>
      <Header>
        <Navbar scrolled={false}/>
        <HeaderContent>
          <TextWrapper>
            <HeaderText>
              Лучшие бесплатные стоковые фото, изображения без роялти и видео от
              талантливых авторов.
            </HeaderText>
            <SearchForm onSubmit={handleSubmit}>
              <SearchInputContainer>
                <SearchInput placeholder="Поиск бесплатных изображений" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                <CustomNavlink><SearchButton type="submite" onClick={handleSubmit}>
                  <SvgIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path d="M21.707 20.293l-5.5-5.5a8 8 0 1 0-1.414 1.414l5.5 5.5a1 1 0 0 0 1.414-1.414zM4 10a6 6 0 1 1 6 6 6.007 6.007 0 0 1-6-6z" />
                  </SvgIcon>
                </SearchButton>
                </CustomNavlink>
              </SearchInputContainer>
            </SearchForm>
            <Tendencies>Тенденции:
                <TendenciesList>
                {tendencies.map(category => (
                    <TendenciesListItem key={category} onClick={() => handleSearch(category)}>{category},</TendenciesListItem>
                  ))}
                </TendenciesList>
            </Tendencies>
          </TextWrapper>

          <Img src={imageUrl}></Img>
          <Author href={authorURL} target="_blank">Автор фото - <span>{authorName}</span></Author>
        </HeaderContent>
      </Header>
      <GalleryWrapper>
        <h5>Бесплатные стоковые фото</h5>
      <ImageGallery/>
      </GalleryWrapper>
    </Wrapper>
  );
}
export default Main;

const Wrapper = styled.div`
  width: 100vw;
  height: 300vh;
`;
const GalleryWrapper = styled.div`
margin:80px;
`
const Header = styled.div`
  position: relative;
  z-index: 9;
  width: 100%;
  min-height: 500px;
`;
const TextWrapper = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 630px;
`;

const SearchForm = styled.form`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SearchInputContainer = styled.div`
  display: flex;
  max-height: 30px;
  align-items: center;
  margin-right: 10px;

`;

const SearchInput = styled.input`
  width: 630px;
  height: 40px;
  font-family: inherit;
  line-height: 1.15;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
  margin-right: 10px;
  margin-bottom: 10px;
  :focus {
  outline: none;
  border: 1px solid #ddd;
}
`;
const CustomNavlink=styled(NavLink)`
position:relative;
text-decoration: none;
z-index: 10;
`
const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 15px;
  padding-left: 15px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background-color: white;
  overflow: visible;
  margin-bottom: 10px;
  position: absolute;
  left: -60px;
  top:-25px;
`;

const SvgIcon = styled.svg`
  path {
    fill: #444; 
  }
  
  &:hover path {
    fill: #05a081; 
  }
`;

const HeaderContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  position: absolute;
  z-index: -2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
`;

const HeaderText = styled.h1`
  font-weight: 600;
  font-size: 33px;
  line-height: 40px;
  text-align: left;
  letter-spacing: -0.02em;
  color: #fff;
`;

const Tendencies = styled.div`
  margin-top  : 30px;
 margin-left: -10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  color: hsla(0,0%,100%,.7);
`;

const TendenciesList = styled.ul`
  list-style: none;
  margin: 0 0 0 5px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`;

const TendenciesListItem = styled.li`
  margin-right: 10px;
  margin-bottom: 10px;
  color: #fff;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: hsla(0,0%,100%,.7);
  }
`;
const Author= styled.a`
    position: absolute;
    bottom: 20px;
    right: 20px;
    text-decoration: none;
    color: hsla(0,0%,100%,.4);
    transition: color 0.3s ease-in-out;
  
  
  
   span {
    color: hsla(0,0%,100%,.7);
    transition: color 0.3s ease-in-out;
   }
   &:hover{
    color: hsla(0, 0%, 100%, .6);

span {
  color: hsla(0, 0%, 100%, 1);
}
  }
  `
