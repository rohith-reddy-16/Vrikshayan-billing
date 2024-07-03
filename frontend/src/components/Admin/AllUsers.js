import React, {useState,useEffect} from 'react';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';
import {MdAdd} from "react-icons/md";
import {FaEye} from "react-icons/fa6";
import swal from 'sweetalert2';
import {MdDelete} from "react-icons/md";
import {FaRegEdit} from "react-icons/fa";

const AllUsers = () => {
  const [data, setdata] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await axios.get('http://localhost:5000/users');
      setdata(response.data);
    }
    loadUsers();
  }, [])

  const ShowPassword = (password) => {
    swal.fire({
      title: 'Password',
      text: password,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

  const AddNewUser = () => {
    swal.fire({
      title: 'Add New User',
      html: `
        <input type='text' id='name' class='swal2-input' placeholder='Username' autoFocus>
        <input type='email' id='email' class='swal2-input' placeholder='Email'>
        <input type='number' id='mobile' class='swal2-input' placeholder='Mobile Number'>
        <input type='password' id='password' class='swal2-input' placeholder='Password'>
        <input type='password' id='confirmpassword' class='swal2-input' placeholder='Confirm Password'>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add User',
      preConfirm: async () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const mobile = document.getElementById('mobile').value;
        const confirmpassword = document.getElementById('confirmpassword').value;
        let res = null;
        try {
          res = await axios.post('http://localhost:5000/register', {
            name,
            email,
            mobile,
            password,
            confirmpassword
          });
          if (res.data.error) {
            swal.fire({
              title: 'Error',
              position: 'top-left',
              text: res.data.error,
              icon: 'error'
            });
          } else {
            const Toast = swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            Toast.fire({
              icon: "success",
              title: "Added successfully"
            });
          }
          window.location.reload();
        } catch (err) {
          swal.fire({
            title: 'Error',
            text: 'Something went wrong',
            icon: 'error'
          });
        }
      }
    });
  }

  const editUser = async (user) => {
    swal.fire({
      title: 'Edit User',
      html: `
        <input type='text' id='edit-name' class='swal2-input' value='${user.name || ''}' placeholder='Username' autofocus>
        <input type='email' id='edit-email' class='swal2-input' value='${user.email || ''}' placeholder='Email'>
        <input type='number' id='edit-mobile' class='swal2-input' value='${user.mobile || ''}' placeholder='Mobile Number'>
        <input type='text' id='edit-password' class='swal2-input' value='${user.password || ''}' placeholder='Password'>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: async () => {
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        const password = document.getElementById('edit-password').value;
        const mobile = document.getElementById('edit-mobile').value;
        try {
          const res = await axios.put(`http://localhost:5000/updateUser/${user._id}`, {
            name,
            email,
            mobile,
            password
          });
          if (res.data.error) {
            swal.fire({
              title: 'Error',
              text: res.data.error,
              icon: 'error'
            });
          } else {
            swal.fire({
              title: 'Success',
              text: 'User updated successfully',
              icon: 'success'
            });
            window.location.reload();
          }
        } catch (err) {
          swal.fire({
            title: 'Error',
            text: 'Something went wrong',
            icon: 'error'
          });
        }
      },
      didOpen: () => {
        // Set focus to the end of the input value for 'edit-name'
        const inputName = document.getElementById('edit-name');
        inputName.focus();
        inputName.setSelectionRange(inputName.value.length, inputName.value.length);
      }
    });
  }
  

  const deleteUser = async (id) => {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:5000/deleteUser/${id}`);
        if (res.data.error) {
          swal.fire({
            title: 'Error',
            text: res.data.error,
            icon: 'error'
          });
        } else {
          swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted.',
            icon: 'success'
          });
          setdata(data.filter(user => user._id !== id));
        }
      } catch (err) {
        swal.fire({
          title: 'Error',
          text: 'Something went wrong',
          icon: 'error'
        });
      }
    }
  }

  return (
    <div className='flex '>
      <AdminSidebar />
      <div className='flex flex-col w-full p-8'>
        <div className='flex justify-end mb-4'>
          <button onClick={AddNewUser} className='flex items-center font-semibold bg-[#228b22] text-white px-4 py-2 rounded hover:bg-[#165816]'>
            <MdAdd className='inline w-6 h-6 mr-2' />
            <span>Create User</span>
          </button>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-md rounded'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='py-2 px-4 border'>Username</th>
                <th className='py-2 px-4 border'>Email</th>
                <th className='py-2 px-4 border'>Password</th>
                <th className='py-2 px-4 border'>Edit</th>
                <th className='py-2 px-4 border'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id} className='text-center border-t'>
                  <td className='py-2 px-4 border'>{user.name}</td>
                  <td className='py-2 px-4 border'>{user.email}</td>
                  <td className='py-2 px-4 border'>
                    <center>
                      <FaEye className='cursor-pointer' onClick={() => ShowPassword(user.password)} />
                    </center>
                  </td>
                  <td className='py-2 px-4 border'>
                    <center>
                      <FaRegEdit className='hover:text-blue-500 cursor-pointer' onClick={() => editUser(user)} />
                    </center>
                  </td>
                  <td className='py-2 px-4 border'>
                    <center>
                      <MdDelete className='text-red-500 cursor-pointer' onClick={() => { deleteUser(user._id) }} />
                    </center>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AllUsers;