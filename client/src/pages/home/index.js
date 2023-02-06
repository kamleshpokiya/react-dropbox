import { Box, Button, Container, Modal } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from 'state';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 1,
};

const Home = () => {
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const { auth: { token } } = useContext(UserContext);
    

    const handleClose = () => {
        setOpen(false);
        setImgSrc(null);
    };

    const getFiles = async () => {
        const allFiles = await axios.get("http://localhost:5000/files",
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        )
        setFiles(allFiles.data);
    }

    useEffect(() => {
        getFiles();
    }, []);

    const getImageMeta = async (file) => {
        const { name } = file
        const fileExtension = name.split('.').pop()
        const localUrl = URL.createObjectURL(file)
        // reading a file to get height and width
        async function getImageParams(file) {
            return new Promise((resolve, reject) => {
                var reader = new FileReader()

                reader.onload = async (e) => {
                    var image = new Image()
                    image.src = e.target.result
                    await image.decode()

                    resolve({ width: image.width, height: image.height })
                }
                reader.readAsDataURL(file)
            })
        }
        const { width, height } = await getImageParams(file)

        return { width, height, fileSize: file.size, fileExtension, localUrl }
    }


    const handleFile = async (event) => {
        const file = event.target.files[0];
        const metaData = await getImageMeta(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('size', file.size);
        formData.append('type', file.type);
        formData.append('name', file.name);
        formData.append('localUrl', metaData?.localUrl);
        formData.append('lastModifiedDate', file?.lastModifiedDate);
        formData.append('fileExtension', metaData?.fileExtension);

        const savedImage = await axios.post("http://localhost:5000/file/upload",
                formData,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        setFiles((prev) => [...prev, savedImage.data]);
    };

    const handleDeleteFile = async (id) => {
        try {
            const deletedFile = await axios.delete(`http://localhost:5000/files/remove/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (deletedFile) {
                setFiles((prev) => prev.filter((file) => file._id !== id));
            }

        } catch (error) {
            console.log('delete error: ', error);
        }
    };


    const handlePreviewFile = (row) => {
        setOpen(true);
        setImgSrc(row.name);
    }


    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
        },
        {
            field: "size",
            headerName: "Size",
            flex: 1,
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
        },
        {
            field: "fileExtension",
            headerName: "Source",
            flex: 1,
        },
        {
            field: "lastModifiedDate",
            headerName: "Last Modified",
            flex: 1,
            renderCell: (row) => {
                return  row.value.substring(0, 10);
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
            getActions: ({id, row}) => {
                return [
                    <GridActionsCellItem
                        icon={<RemoveRedEyeIcon />}
                        label="Preview"
                        color='inherit'
                        onClick={() => handlePreviewFile(row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        color='inherit'
                        onClick={() => handleDeleteFile(id)}
                    />,
                ];
            }
            
        },
    ];


  return (
    <Container maxWidth = "xl">
          <Box
              width="100%"
              p="1rem 0"
              m ="2rem 0"
          >
              <Button variant="contained" component="label">
                  Upload File
                  <input hidden type="file" accept="image/*" onChange={handleFile} />
              </Button>

              <Box
                  sx={{
                      m: "3rem 0%",
                      display: "flex",
                }}
              >
                  <DataGrid
                      autoHeight
                      getRowId={(row) => row._id}
                      rows={files}
                      columns={columns}
                  />
              </Box>
              
          </Box>

          {open && 
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
              >
                  <Box sx={style}>
                      <Box
                          component="img"
                          src={`http://localhost:5000/assets/${imgSrc}`}
                          alt="img"
                          sx={{
                              width: '100%',
                              height: "100%",
                              objectFit: "contain"
                          }}
                      />
                  </Box>
              </Modal>
          }
          
    </Container>
  )
}

export default Home;
