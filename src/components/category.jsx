import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { Dropdown, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { createClient } from "pexels";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import like from "../img/like.svg";
import likeTrue from "../img/liketrue.svg";
import download from "../img/download.svg";
const client = createClient(
  "563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf"
);


const Category = () => {
  const location = useLocation();
const searchParams = new URLSearchParams(location.search);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(searchParams.get("query"));
  const [column1Images, setColumn1Images] = useState([]);
  const [column2Images, setColumn2Images] = useState([]);
  const [column3Images, setColumn3Images] = useState([]);
  const [likes, setLikes] = useState({});
  const [orientation, setOrietation] = useState("Orientation");
  const [size, setSize] = useState("Size");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setPage(1)
      setColumn1Images(()=>[])
      setColumn2Images(()=>[])
      setColumn3Images(()=>[])
      setImages([])
      fetchImages()
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1 &&
      !loading
    ) {
      setLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


    const fetchImages = async () => {
      try {
        console.log("page", page, query)
        const orientationParam =
          orientation !== "Orientation"
            ? `&orientation=${orientation.toLowerCase()}`
            : "";
        const sizeParam = size !== "Size" ? `&size=${size.toLowerCase()}` : "";

        const response = await axios.get(
          `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=${page}${orientationParam}${sizeParam}`,
          {
            headers: {
              Authorization:
                "563492ad6f917000010000014640aabb4e9d420cbe1c0df7daf4c2bf",
            },
          }
        );
        const newImages = response.data.photos.map((photo) => ({
          id: photo.id,
          src: photo.src.large2x,
          photographer: photo.photographer,
          authorURL: photo.photographer_url,
        }));

        const savedLikes = JSON.parse(localStorage.getItem("likes")) || {};

        setLikes(savedLikes);

        const updatedImages = newImages.map((image) => {
          if (savedLikes[image.id]) {
            return { ...image, liked: true };
          } else {
            return image;
          }
        });
        if (page === 1) {
       console.log(column1Images)

          setImages(updatedImages);
          setLoading(false);
          const imagesByColumn = updatedImages.reduce(
            (acc, image, index) => {
              if (index % 3 === 0) {
                acc[0].push(image);
              } else if (index % 3 === 1) {
                acc[1].push(image);
              } else {
                acc[2].push(image);
              }
              return acc;
            },
            [[], [], []]
          );
          setColumn1Images(() => [...imagesByColumn[0]]);
          setColumn2Images(() => [...imagesByColumn[1]]);
          setColumn3Images(() => [...imagesByColumn[2]]);
        }
        else {
          setImages((prevImages) => [...prevImages, ...updatedImages]);
          setLoading(false);
          const imagesByColumn = updatedImages.reduce(
            (acc, image, index) => {
              if (index % 3 === 0) {
                acc[0].push(image);
              } else if (index % 3 === 1) {
                acc[1].push(image);
              } else {
                acc[2].push(image);
              }
              return acc;
            },
            [[], [], []]
          );
          setColumn1Images((prevColumn1Images) => [...prevColumn1Images, ...imagesByColumn[0]]);
          setColumn2Images((prevColumn2Images) => [...prevColumn2Images, ...imagesByColumn[1]]);
          setColumn3Images((prevColumn3Images) => [...prevColumn3Images, ...imagesByColumn[2]]);
        }
        
      } catch (error) {
        console.log("Error fetching images:", error);
        setLoading(false);
      }
    };
useEffect(()=>{
  fetchImages()
}, [page])
useEffect(()=>{
  setPage(1)
  setColumn1Images(()=>[])
  setColumn2Images(()=>[])
  setColumn3Images(()=>[])
  setImages([])
  fetchImages()
}, [orientation,size])
  const handlerClick = async (photoId) => {
    try {
      const photo = await client.photos.show({ id: photoId });
      const imageURL = photo.src.original;

      const response = await axios.get(imageURL, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `image${photoId}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading photo:", error);
    }
  };

  const handleLike = (photoId) => {
    setLikes((prevLikes) => {
      const updatedLikes = { ...prevLikes };
      if (updatedLikes[photoId]) {
        delete updatedLikes[photoId];
      } else {
        updatedLikes[photoId] = true;
      }
      localStorage.setItem("likes", JSON.stringify(updatedLikes));

      return updatedLikes;
    });
  };
  return (
    <div>
      <NavbarContainer>
        <CustomNavlink to="/">
          <Logo src="https://images.pexels.com/lib/api/pexels.png" />{" "}
        </CustomNavlink>
        <SearchContainer placeholder="Search">
          <SearchInput
            id="search"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={fetchImages}>
            <SvgIcon
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M21.707 20.293l-5.5-5.5a8 8 0 1 0-1.414 1.414l5.5 5.5a1 1 0 0 0 1.414-1.414zM4 10a6 6 0 1 1 6 6 6.007 6.007 0 0 1-6-6z" />
            </SvgIcon>
          </SearchButton>
        </SearchContainer>
      </NavbarContainer>
      <CategoryContainer>
        <Title>фото {query}</Title>
        <DropdownContainer>
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {orientation}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setOrietation("all orienations")}>
                all orienations
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrietation("landscape")}>
                landscape
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrietation("portrait")}>
                portrait
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setOrietation("square")}>
                square
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {size}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSize("all sizes")}>
                all sizes
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSize("large")}>
                large
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSize("medium")}>
                medium
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSize("small")}>
                small
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </DropdownContainer>
        <ImageGalleryContainer>
          <Column>
            {column1Images.map((image) => (
              <ImageWrapper key={image.id}>
                <Image src={image.src} alt={image.photographer} />
                <Overlay>
                  <Button className="author-button">
                    <a
                      href={image.authorURL}
                      target="_blank"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {image.photographer}
                    </a>
                  </Button>
                  <Button
                    className="download-button"
                    onClick={() => handlerClick(image.id)}
                  >
                    <img src={download} style={{ width: "20px" }}></img>
                  </Button>
                  <Button
                    className="like-button"
                    onClick={() => handleLike(image.id)}
                  >
                    {!likes[image.id] ? (
                      <img src={like} style={{ width: "20px" }}></img>
                    ) : (
                      <img src={likeTrue} style={{ width: "20px" }}></img>
                    )}
                  </Button>
                </Overlay>
              </ImageWrapper>
            ))}
          </Column>
          <Column>
            {column2Images.map((image) => (
              <ImageWrapper key={image.id}>
                <Image src={image.src} alt={image.photographer} />
                <Overlay>
                  <Button className="author-button">
                    <a
                      href={image.authorURL}
                      target="_blank"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {image.photographer}
                    </a>
                  </Button>
                  <Button
                    className="download-button"
                    onClick={() => handlerClick(image.id)}
                  >
                    <img src={download} style={{ width: "20px" }}></img>
                  </Button>
                  <Button
                    className="like-button"
                    onClick={() => handleLike(image.id)}
                  >
                    {!likes[image.id] ? (
                      <img src={like} style={{ width: "20px" }}></img>
                    ) : (
                      <img src={likeTrue} style={{ width: "20px" }}></img>
                    )}
                  </Button>
                </Overlay>
              </ImageWrapper>
            ))}
          </Column>
          <Column>
            {column3Images.map((image) => (
              <ImageWrapper key={image.id}>
                <Image src={image.src} alt={image.photographer} />
                <Overlay>
                  <Button className="author-button">
                    <a
                      href={image.authorURL}
                      target="_blank"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {image.photographer}
                    </a>
                  </Button>
                  <Button
                    className="download-button"
                    onClick={() => handlerClick(image.id)}
                  >
                    <img src={download} style={{ width: "20px" }}></img>
                  </Button>
                  <Button
                    className="like-button"
                    onClick={() => handleLike(image.id)}
                  >
                    {!likes[image.id] ? (
                      <img
                        src={like}
                        alt="emptylike"
                        style={{ width: "20px" }}
                      ></img>
                    ) : (
                      <img
                        src={likeTrue}
                        alt="fulllike"
                        style={{ width: "20px" }}
                      ></img>
                    )}
                  </Button>
                </Overlay>
              </ImageWrapper>
            ))}
          </Column>
        </ImageGalleryContainer>
        {loading && (
          <LoadingIndicator>
            <Spinner animation="border" role="status" />
          </LoadingIndicator>
        )}
      </CategoryContainer>
    </div>
  );
};

export default Category;

const CategoryContainer = styled.div`
  padding-right: 30px;
  padding-left: 30px;
  margin: 120px 50px 0 40px;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 49px;
  line-height: 65px;
  letter-spacing: -0.02em;
  color: #2c343e;
  fill: #2c343e;
  border: none;
  outline: none;
  margin-top: 130px;
  margin-bottom: 0px;
`;
const StyledDropdown = styled(Dropdown)`
  position: relative;
  z-index: 2;
`;

const StyledToggle = styled(Dropdown.Toggle)`
  background-color: white;

  color: black;
  border-color: black;
  &::after {
    display: none;
  }
  &:hover {
    background-color: white;
    color: black;
    border-color: black;
  }
  svg {
    transition: transform 0.2s ease-in-out;
  }

  &.show svg {
    transform: rotate(180deg);
  }
`;
const StyledInnerDropdown = styled(Dropdown)`
  position: static !important;
`;

const ImageGalleryContainer = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;
const Overlay = styled.div`
  width: 100%;
  height: 100%;
`;
const Button = styled.button`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 100;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &.download-button {
    bottom: 15px;
    right: 15px;
    &:hover {
      filter: brightness(0.9);
    }
  }

  &.like-button {
    top: 15px;
    right: 15px;
    &:hover {
      filter: brightness(0.9);
    }
  }
  &.author-button {
    bottom: 15px;
    left: 15px;
    background-color: rgba(1, 1, 1, 0);
    color: #ffffff;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  &:hover {
    ${Image} {
      filter: brightness(0.7);
    }

    ${Overlay} {
      opacity: 1;
    }

    ${Button} {
      opacity: 1;
    }
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;
const DropdownContainer = styled.div`
  display: flex;
  position: absolute;
  right: 5%;
`;

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 1px 0 #f7f7f7;
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;
  height: 80px;
  transition: background 0.2s ease, box-shadow 0.2s ease;
`;
const CustomNavlink = styled(NavLink)`
  text-decoration: none;
  color: black;
  &:hover {
    color: #333;
  }
`;
const Logo = styled.img`
  position: relative;
  width: 130px;
  left: 40px;
`;

const SearchContainer = styled.form`
  display: flex;
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
    border-right: 1px solid #dfdfe0;
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
    border-left: 1px solid #08087d;
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
