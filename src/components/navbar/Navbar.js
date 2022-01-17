import React, { useState } from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    await signOut(auth);
  };

  const userLoggedIn = auth.currentUser;

  return (
    <Nav>
      <Link to="/">
        <Logo src="/images/famlife-logo.png" alt="" />
      </Link>
      {userLoggedIn !== null ? (
        <>
          <HamburgerLoggedIn onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </HamburgerLoggedIn>
          <Menu isOpen={isOpen}>
            <MenuLinkLoggedIn href="/" onClick={logout}>
              Log out
            </MenuLinkLoggedIn>
            <MenuLinkLoggedIn href="/dashboard">Dashboard</MenuLinkLoggedIn>
          </Menu>
        </>
      ) : (
        <>
          <Hamburger onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </Hamburger>
          <Menu isOpen={isOpen}>
            <MenuLink href="/login">Log in</MenuLink>
            <MenuLink href="/register">Sign up</MenuLink>
          </Menu>
        </>
      )}
    </Nav>
  );
};

const currentUrl = window.location.pathname;

const Nav = styled.div`
  padding: 0 1rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Logo = styled.img`
  margin: 0;
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  span {
    height: 3px;
    width: 25px;
    background: ${() => (currentUrl === "/" ? "white" : "green")};
    margin-bottom: 5px;
    border-radius: 5px;
  }
  @media (max-width: 768px) {
    display: flex;
  }
`;

const HamburgerLoggedIn = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  span {
    height: 3px;
    width: 25px;
    background: ${() => (currentUrl === "/" ? "white" : "green")};
    margin-bottom: 5px;
    border-radius: 5px;
  }
  @media (max-width: 768px) {
    display: flex;
  }
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    overflow: hidden;
    flex-direction: column;
    width: 100%;
    max-height: ${(props) => (props.isOpen ? "200px" : "0px")};
  }
`;

const MenuLink = styled.a`
  padding: 1rem 1rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: ${() => (currentUrl === "/" ? "white" : "green")};
  transition: all 0.3 ease-in;
  font-size: 0.9rem;
  &:hover {
    color: black;
  }
`;

const MenuLinkLoggedIn = styled.a`
  padding: 1rem 1rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: ${() => (currentUrl === "/" ? "white" : "green")};
  transition: all 0.3 ease-in;
  font-size: 0.9rem;
  &:hover {
    color: black;
  }
`;
