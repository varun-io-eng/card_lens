import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, Image } from 'lucide-react';

export default function DropZone({ onFile, uploaded }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1,
    onDrop: (files) => {
      if (!files[0]) return;
      const reader = new FileReader();
      reader.onload = (e) => onFile({ name: files[0].name, data: e.target.result.split(',')[1] });
      reader.readAsDataURL(files[0]);
    },
  });

  return (
    <motion.div
      {...getRootProps()}
      animate={{
        borderColor: isDragActive ? '#4f8ef7' : uploaded ? '#22d3a5' : 'rgba(255,255,255,0.13)',
        background: isDragActive ? 'rgba(79,142,247,0.07)' : uploaded ? 'rgba(34,211,165,0.05)' : 'rgba(255,255,255,0.015)',
      }}
      whileHover={{ scale: 1.005, borderColor: '#4f8ef7' }}
      style={{
        border: '1.5px dashed rgba(255,255,255,0.13)',
        borderRadius: 14, padding: '1.5rem',
        textAlign: 'center', cursor: 'pointer',
        transition: 'all 0.25s',
      }}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {uploaded ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <CheckCircle size={28} color="#22d3a5" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: '#22d3a5', marginBottom: 3 }}>
              {uploaded.name}
            </div>
            <div style={{ fontSize: 11, color: '#5e5c72' }}>Click to replace</div>
          </motion.div>
        ) : isDragActive ? (
          <motion.div
            key="drag"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Image size={28} color="#4f8ef7" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: '#4f8ef7' }}>Drop it here</div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, margin: '0 auto 12px',
              background: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(124,92,252,0.15))',
              border: '1px solid rgba(79,142,247,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Upload size={20} color="#4f8ef7" />
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#eeedf0', marginBottom: 4 }}>
              Drop card image here
            </div>
            <div style={{ fontSize: 11, color: '#9d9bab' }}>PNG, JPG, PDF supported</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
