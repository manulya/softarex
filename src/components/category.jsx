import React from "react";
import Navbar from "./Navbar";
import { Dropdown } from "react-bootstrap";
import styled from "styled-components";

function Category() {
  return (
    <div>
      <Navbar scrolled={true} />
      <CategoryContainer>
        <Title> фото New York</Title>
        <StyledDropdown variant="light">
          <StyledToggle variant="light" id="dropdown-basic">
            Фильтры
            <svg
              class="spacing_noMargin__Q_PsJ"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                id="filter_list-f2ecbc88f73bd1adcf5a04f89af6f1b9_Icon"
                d="M10.778,18.955h4.444V16.732H10.778ZM3,7V9.222H23V7Zm3.333,7.088H19.667V11.866H6.333Z"
                transform="translate(-1 -1)"
              ></path>
            </svg>
          </StyledToggle>
          <Dropdown.Menu style={{ zIndex: "2" }}>
            <Dropdown.Item>
              <Dropdown variant="light">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {" "}
                  Все ориентации
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Все ориентации</Dropdown.Item>
                  <Dropdown.Item>Горизонтальная</Dropdown.Item>
                  <Dropdown.Item>Вертикальная</Dropdown.Item>
                  <Dropdown.Item>Квадратные изображения</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>

            <Dropdown.Item>
              <Dropdown variant="light">
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  Все размеры
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Все размеры</Dropdown.Item>
                  <Dropdown.Item>Большой</Dropdown.Item>
                  <Dropdown.Item>Средний</Dropdown.Item>
                  <Dropdown.Item>Маленький</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>
          </Dropdown.Menu>
        </StyledDropdown>
      </CategoryContainer>
    </div>
  );
}
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
  position: absolute;
  right: 0%;
  margin-right: 100px;
`;

const StyledToggle = styled(Dropdown.Toggle)`
  background-color: white;

  color: black;
  border-color: black;
  &::after {
    display: none;
  }
  &:hover,
  &:focus,
  &:active,
  &.show {
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
