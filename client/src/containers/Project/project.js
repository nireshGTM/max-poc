import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Switch,
  Checkbox
} from 'antd';
import { useNavigate, } from "react-router-dom";
import { connect } from 'react-redux';
import actions from '../../actions';
import Notification from "../../components/Notification";
import FormError from "../../components/FormError";
import moment from 'moment-timezone';
import { List, Space } from 'antd';
import {Link} from 'react-router-dom';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { BASE_API_URL } from '../../config';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Project = (props) => {
  const { authenticated, projectFormData, projectFormChange, projectSingle, projectFormReset, projectSave, formErrors, getEngineers, getCategories, engineers, categories, setProjectData, projectDelete, isLoading, isSubmitting } = props;
  const Id = new URLSearchParams(location.search).get('id');
  const statuses = ["Started","In-progress","Active","Completed"]
  const [loaded, setLoaded] = useState(false);
  const [componentDisabled, setComponentDisabled] = useState(true);

  // useEffect(() => {
  //   if (!authenticated) navigate('/login');
  // }, [authenticated]);
  
  
  const loadProject = useCallback(async() => {
     if(Id === null) {
       setLoaded(true)
     } else {
       await setProjectData(Id).then(() => {
         setLoaded(true);
         setComponentDisabled(true)
       })
     }
  }, [setProjectData, Id, setLoaded])

  useEffect(() => {
    if (loaded === false) {
      loadProject();
    }
  }, [loaded, loadProject])

  useEffect(() => {
    if (Id === null) {
    projectFormReset()
    }
  }, [Id])

  let navigate = useNavigate();
  const [loading,setLoading]=useState(true);



  const handleSubmit = async (e) => {
    e.preventDefault();
    await projectSave(navigate,Id);
    if(Id)
    setLoaded(false);
  };

  useEffect(() => {
    if (loading)
    {
      getEngineers();
      getCategories();
      setLoading(false);
    }
  }, [loading, getEngineers, getCategories ]);
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  

  return (
    <div className="container">
      <Notification {...props} />
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {
            (Id && projectSingle._id && componentDisabled) ?
            <>
            { (projectSingle.design) ?
                <img
                className="col-md-10 offset-md-1"
                  alt="logo"
                  src={BASE_API_URL+"/"+projectSingle.design}
                />
                :
                <img
                className="col-md-10 offset-md-1"
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              }
              <h4 style={{"textAlign":"center",marginTop:"50px"}}><a href={projectSingle.href}>{projectSingle.project_name}</a></h4>
              <List.Item
              key={projectSingle._id}
              extra=""
              >
              <List.Item.Meta
                title=""
                description={
                  <>
                  <div style={{"textAlign":"right"}}>
                    {(projectSingle.blue_print) && <><a href={BASE_API_URL+"/"+projectSingle.blue_print}>BluePrint <IconText icon={DownloadOutlined} text="" key="list-vertical-like-o" /></a>&nbsp;|&nbsp;</>} 
                    {<><a href={'#'} onClick={(e)=>{e.preventDefault; projectDelete(navigate,projectSingle._id)}}>Delete <IconText icon={DeleteOutlined} text="" key="list-vertical-like-o" /></a>&nbsp;|&nbsp;</>} 
                    
                    {(authenticated) && <><Switch  onChange={checked => setComponentDisabled(checked)} defaultChecked={componentDisabled} /> Edit </>}
                  </div>
                  <p>{projectSingle.description}</p>
                  <p><b>Project Head : {projectSingle.project_head.engineer_name}</b></p>
                  <p><b>Starte on : {projectSingle.start_date}</b></p>
                  <p><b>Release : {projectSingle.due_date}</b></p>

                  <p><b>
                    Status : {projectSingle.status} | 
                    Category : {projectSingle.category.name}                          
                  </b></p>
                  <p>Location : {projectSingle.location} </p>

                  </>
                  
                }
              />
          </List.Item>  
          </>
            :""
          }
          </div>
          {(authenticated) &&
          <>
          <div className="col-md-8 offset-md-2" style={(Id && componentDisabled)?{display:"none"}:{display:"block"}}>
            <h4 style={{"textAlign":"center"}}>{(Id)?"Edit":"Create"} Project</h4>
          
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onSubmit={handleSubmit}
              disabled={Id && componentDisabled ? true : false}
            >
              <Form.Item label="Title:">
              <Input
                type="text"
                className="ant-input"
                name="project_name"
                value={projectFormData.project_name} onChange={e => projectFormChange(e.target.name, e.target.value)}
                placeholder=""
              />
              <FormError formErrors={formErrors} element="project_name"/>
              </Form.Item>

              <Form.Item label="Project Head">
                <Select
                name="project_head"
                value={projectFormData.project_head} onChange={value => projectFormChange('project_head', value)}>
                  {
                    engineers.map((engineer, index)=>(
                    <Select.Option key={index} value={engineer._id}>{engineer.engineer_name}</Select.Option>
                    ))
                  }                  
                </Select>
                <FormError formErrors={formErrors} element="project_head"/>
              </Form.Item>

              <Form.Item label="Category">
                <Select
                name="category"
                value={projectFormData.category} onChange={value => projectFormChange('category', value)}>
                  {
                    categories.map((category, index)=>(
                    <Select.Option key={index} value={category._id}>{category.name}</Select.Option>
                    ))
                  }
                </Select>
                <FormError formErrors={formErrors} element="category"/>
              </Form.Item>

              <Form.Item label="Location">
              <Input
                type="text"
                className="ant-input"
                name="location"
                value={projectFormData.location} onChange={e => projectFormChange(e.target.name, e.target.value)}
                placeholder=""
              />
              <FormError formErrors={formErrors} element="location"/>
              </Form.Item>

              <Form.Item label="Start Date">
                <DatePicker value={(projectFormData.start_date) && moment(projectFormData.start_date)} onChange={date => projectFormChange('start_date', date)} />
                <FormError formErrors={formErrors} element="start_date"/>
              </Form.Item>
              <Form.Item label="Due Date">
                <DatePicker value={(projectFormData.start_date) && moment(projectFormData.due_date)} onChange={date => projectFormChange('due_date', date)} />
                <FormError formErrors={formErrors} element="due_date"/>
              </Form.Item>

              <Form.Item label="Description">
                <TextArea rows={4}  name="description"
                value={projectFormData.description} onChange={e => projectFormChange(e.target.name, e.target.value)} />
                <FormError formErrors={formErrors} element="description"/>
              </Form.Item>

              <Form.Item label="Status" valuePropName="checked">
                <Select
                  name="status"
                  value={projectFormData.status} onChange={value => projectFormChange('status', value)}>
                    {
                      statuses.map((status, index)=>(
                      <Select.Option key={index} value={status}>{status}</Select.Option>
                      ))
                    }
                </Select>
              </Form.Item>

              <Form.Item label="Blue Print" valuePropName="fileList">
                {projectSingle.blue_print && <a href={BASE_API_URL+"/"+projectSingle.blue_print}>{BASE_API_URL+"/"+projectSingle.blue_print}</a>}
                <input type="file" accept="pdf" name="blue_print" onChange={(e) => projectFormChange(e.target.name, e.target.files[0])}/>
                <FormError formErrors={formErrors} element="blue_print"/>
              </Form.Item>

              <Form.Item label="Image" valuePropName="fileList">
                {projectSingle.design && <a href={BASE_API_URL+"/"+projectSingle.design}>{BASE_API_URL+"/"+projectSingle.design}</a>}
                <input type="file" accept="jgp|jpeg|gif" name="design" onChange={(e) => projectFormChange(e.target.name, e.target.files[0])}/>
                <FormError formErrors={formErrors} element="design"/>
              </Form.Item>

              <p style={{"marginLeft":"125px"}}>
                <Button type="primary" onClick={handleSubmit}>{(Id)?"Edit":"Create"} Project</Button>
              </p>
            </Form>
            <br />
            <br />
          </div>
        </>
        }
    </div>
    </div >
  );
};

const mapStateToProps = state => {
  return {
    projectFormData: state.project.projectFormData,
    formErrors: state.project.formErrors,
    isLoading: state.project.isLoading,
    isSubmitting: state.project.isSubmitting,
    engineers: state.project.engineers,
    categories: state.project.categories,
    projectSingle: state.project.projectSingle
  };
};

export default connect(mapStateToProps, actions)(Project);
