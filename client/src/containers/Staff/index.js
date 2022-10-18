import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Button
} from 'antd';
import { useNavigate, } from "react-router-dom";
import { connect } from 'react-redux';
import actions from '../../actions';
import Notification from "../../components/Notification";
import FormError from "../../components/FormError";
import { List, Space } from 'antd';
import {Link} from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const Staff = (props) => {
  const { authenticated, staffFormData, staffFormChange, staffFormReset, staffSave, formErrors, getEngineers,  engineers, reloadStaff, setReload, setStaffData, staffDelete } = props;
  const Id = new URLSearchParams(location.search).get('id');
  const statuses = ["Started","In-progress","Active","Completed"]
  const [loaded, setLoaded] = useState(false);
  let navigate = useNavigate();
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    if (!authenticated) navigate('/login');
  }, [authenticated]);
  
  
  const loadStaff = useCallback(async() => {
     if(Id === null) {
       setLoaded(true)
     } else {
       await setStaffData(Id).then(() => {
         setLoaded(true);
       })
     }
  }, [setStaffData, Id, setLoaded])

  useEffect(() => {
    if (loaded === false) {
      loadStaff();
    }
  }, [loaded, loadStaff])

  useEffect(() => {
    if (reloadStaff === true) {
      getEngineers();
      setReload(false);
    }
  }, [reloadStaff, getEngineers])

  useEffect(() => {
    if (Id === null) {
    staffFormReset()
    }
    else
    {setLoaded(true);loadStaff();}
  }, [Id])

  useEffect(() => {
    if (loading)
    {
      getEngineers();
      setLoading(false);
    }
  }, [loading, setLoading, getEngineers ]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await staffSave(navigate,Id);
    if(Id)
    setLoaded(false);
  };

  return (
    <div className="container">
      <Notification {...props} />
      <div className="row">
          <>
          <div className="col-md-8 offset-md-2">
            <h4 style={{"textAlign":"center"}}>{(Id)?"Edit":"Create"} Staff/Project Head</h4>
          
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onSubmit={handleSubmit}
            >
              <Form.Item label="Name:">
              <Input
                type="text"
                className="ant-input"
                name="engineer_name"
                value={staffFormData.engineer_name} onChange={e => staffFormChange(e.target.name, e.target.value)}
                placeholder=""
              />
              <FormError formErrors={formErrors} element="engineer_name"/>
              </Form.Item>

              <Form.Item label="Email:">
              <Input
                type="text"
                className="ant-input"
                name="email"
                value={staffFormData.email} onChange={e => staffFormChange(e.target.name, e.target.value)}
                placeholder=""
              />
              <FormError formErrors={formErrors} element="email"/>
              </Form.Item>

              <p style={{"marginLeft":"125px"}}>
                <Button type="primary" onClick={handleSubmit}>{(Id)?"Edit":"Create"} Staff/Project Head</Button>
              </p>
            </Form>
            <hr />
            <div className="ant-table-content">
            <table width={"100%"} style={{tableLayout: "auto"}}>
              <thead className="ant-table-thead">
              <tr><th className="ant-table-cell">Name</th><th className="ant-table-cell">Email</th><th className="ant-table-cell">Action</th></tr>
              </thead>
              <tbody className="ant-table-tbody">
              {
                    engineers && engineers.map((engineer, index)=>(
                      <tr key={index} className="ant-table-row ant-table-row-level-0">
                        <td className="ant-table-cell">{engineer.engineer_name}</td><td className="ant-table-cell">{engineer.email}</td>
                        <td className="ant-table-cell">
                        {<><a href={'#'} onClick={(e)=>{e.preventDefault; staffDelete(navigate, engineer._id)}}>Delete <IconText icon={DeleteOutlined} text="" key="list-vertical-like-o" /></a>&nbsp;|&nbsp;</>} 
                        {<Link to={'/staff/?id='+engineer._id}>Edit <IconText icon={EditOutlined} text="" key="list-vertical-like-o" /></Link>} 
                        </td>
                      </tr>
                    ))
                  }   
              </tbody>
            </table>
            </div>
          </div>
        </>
    </div>
    </div >
  );
};

const mapStateToProps = state => {
  return {
    staffFormData: state.staff.staffFormData,
    formErrors: state.staff.formErrors,
    engineers: state.project.engineers,
    isLoading: state.staff.isLoading,
    isSubmitting: state.staff.isSubmitting,
    staffSingle: state.staff.staffSingle,
    reloadStaff: state.staff.reloadStaff

  };
};

export default connect(mapStateToProps, actions)(Staff);
