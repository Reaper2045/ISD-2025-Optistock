// client/src/components/MaterialDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiService from '../services/api';
import Navbar from './Navbar';
import { useLogout } from '../hooks/useAuth';

function MaterialDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  
  // Query to fetch material details
  const { data, isLoading, error } = useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      const response = await apiService.materials.getById(id);
      if (response.data && response.data.data) {
        // Format data to match our component structure
        const material = response.data.data;
        return {
          id: material.id,
          packetNo: parseInt(material.packet_no),
          partName: material.part_name,
          materialCode: material.material_code,
          length: parseInt(material.length),
          width: parseInt(material.width),
          materialType: material.materialType,
          quantity: parseInt(material.quantity),
          supplier: material.supplier,
          updatedBy: material.updated_by,
          lastUpdated: material.last_updated
        };
      }
      throw new Error('Material not found');
    },
    retry: 1,
  });
  
  const handleBack = () => {
    navigate('/materials');
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error.message}</div>
        <button className="btn btn-primary" onClick={handleBack}>
          Back to Materials
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Material Details</h5>
              <button className="btn btn-sm btn-light" onClick={handleBack}>
                <i className="fas fa-arrow-left me-1"></i> Back to Materials
              </button>
            </div>
          </div>
          <div className="card-body">
            <h2 className="mb-4">{data.partName}</h2>
            <div className="row">
              <div className="col-md-8">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Packet No</th>
                      <td>{data.packetNo}</td>
                    </tr>
                    <tr>
                      <th style={{ width: '30%' }}>Material Code</th>
                      <td>{data.materialCode}</td>
                    </tr>

                    <tr>
                      <th>Dimensions</th>
                      <td>{data.length} x {data.width}</td>
                    </tr>
                    <tr>
                      <th>Material Type</th>
                      <td>{data.materialType}</td>
                    </tr>
                    <tr>
                      <th>Quantity</th>
                      <td>{data.quantity}</td>
                    </tr>
                    <tr>
                      <th>Supplier</th>
                      <td>{data.supplier}</td>
                    </tr>
                    <tr>
                      <th>Updated By</th>
                      <td>{data.updatedBy}</td>
                    </tr>
                    <tr>
                      <th>Last Updated</th>
                      <td>{data.lastUpdated}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-edit me-1"></i> Edit Material
                      </button>
                      <button className="btn btn-outline-success">
                        <i className="fas fa-print me-1"></i> Print Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialDetail;