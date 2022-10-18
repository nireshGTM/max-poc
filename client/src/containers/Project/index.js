import React, { useState, useEffect } from "react";
import Notification from "../../components/Notification";
import actions from '../../actions';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { LikeOutlined, MessageOutlined, PlusCircleOutlined, StarOutlined } from '@ant-design/icons';
import { List, Space } from 'antd';
import { BASE_API_URL } from '../../config';
import {Link} from 'react-router-dom';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const Projects = (props) => {
  const { authenticated, getProjects, projects } = props;

  const [loading,setLoading]=useState(true);

  useEffect(() => {
    if (loading)
    {
      getProjects();
      setLoading(false);
    }
  }, [loading, getProjects ]);

  return (
    <div>
      <Notification {...props}/>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h4 style={{"textAlign":"center", marginTop:"40px"}}>
            Projects
            <Link style={{"float":"right", fontSize:"20px"}} to={`/project`}>{React.createElement(PlusCircleOutlined)} Add New Project</Link>
            </h4>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={projects}
              
              renderItem={(item) => (
                <List.Item
                    key={item._id}
                    actions={[
                      <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                      <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                      <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                    ]}
                    extra={ (item.design) ?
                      <Link to={`/project/?id=${item._id}`}>
                      <img
                        width={272}
                        alt="logo"
                        src={BASE_API_URL+"/"+item.design}
                      />
                      </Link>
                      :
                      <Link to={`/project/?id=${item._id}`}>
                      <img
                        width={272}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                      />
                      </Link>
                    }
                    >
                    <List.Item.Meta
                      title={<Link to={`/project/?id=${item._id}`}>{item.project_name}</Link>}
                      description={
                        <>
                        {item.description}
                        <p><b>
                          Status:{item.status} | 
                          Category:{item.category.name}                          
                        </b></p>
                        <p>Location:{item.location} </p>
                        </>
                        
                      }
                    />
                </List.Item>
              )}
            />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    engineers: state.project.engineers,
    projects: state.project.projects
  };
};

export default connect(mapStateToProps, actions)(Projects);

