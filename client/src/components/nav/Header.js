import React, {useState} from "react";
import { Menu } from 'antd';
import { HomeOutlined, LogoutOutlined, LoginOutlined, AppstoreOutlined, PaperClipOutlined, SettingOutlined } from '@ant-design/icons';
import {Link, useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Header = (props) => {
    const {authenticated, signOut} = props;
    const location = useLocation().pathname.replace("/","");
    const [current, setCurrent] = useState((location)?location:'home');

    const handleClick = (e)=>{
      setCurrent(e.key)
    }
    let navigate = useNavigate();

    const logout = () => {
        setCurrent('login')
        signOut()
        navigate("/login");
      };

    return (
    <Menu onClick={handleClick} mode="horizontal" defaultSelectedKeys={[current]}>
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="projects" icon={<PaperClipOutlined />}>
        <Link to="/projects">Projects</Link>
      </Menu.Item>
      {(!authenticated)&&
            <Menu.Item key="login" icon={<LoginOutlined />} className="float-right">
            <Link to="/login">Login</Link>
            </Menu.Item>
      }
      {(authenticated)&&
      <>
        <Menu.SubMenu key="manage" title="Manage" icon={<SettingOutlined />}>
          <Menu.Item key="proejcts" icon={<AppstoreOutlined />}>
            <Link to="/project">Create Project</Link>
            
          </Menu.Item>
          <Menu.Item key="staffs" icon={<AppstoreOutlined />}>
            <Link to="/staff">Manage Staff</Link>
          </Menu.Item>        
        </Menu.SubMenu>
        <Menu.Item onClick={logout} key="logout" icon={<LogoutOutlined />} className="float-right">
          Logout
        </Menu.Item>
      </>
      }
    </Menu>
  )};
  
  export default Header;