import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

// Corrected style object
const style = {
  position: "absolute", // <--- REMOVED 'as "absolute"'
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "90vw",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1, // Padding around the image container
  outline: "none", // Remove default focus outline
};

const ImageModal: React.FC<ImageModalProps> = ({
  open,
  onClose,
  imageUrl,
  altText,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="image-modal-title"
      aria-describedby="image-modal-description"
      closeAfterTransition
    >
      <Box sx={style}>
        <Tooltip title="Close Image Viewer">
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute", // This one is also fine without assertion
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <img
          src={imageUrl}
          alt={altText}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "calc(90vh - 16px)",
          }} // Adjust max height based on padding
        />
      </Box>
    </Modal>
  );
};

export default ImageModal;
