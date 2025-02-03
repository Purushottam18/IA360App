import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Button, StyleSheet, Text, Alert, View, TouchableOpacity, useColorScheme } from 'react-native';
import { SERVER_URL } from '../../appConstants';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-blob-util';

export default function Upload({ navigation, route }) {
  const [videoUri, setVideoUri] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Detect device theme
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  const pickVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
        allowMultiSelection: false,
      });

      if (res && res.length > 0) {
        setVideoUri(res[0].uri);
        setVideoName(res[0].name);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Error picking video:', err);
      }
    }
  };

  const uploadVideo = async () => {
    if (!videoUri || !selectedProject || !selectedFloor) {
      Alert.alert('Missing Fields', 'Please select a project, floor, and video before uploading.');
      return;
    }

    setIsUploading(true); // Start uploading
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    const formattedFileName = `${selectedProject}-${selectedFloor}-${timestamp}_VID_${videoName.replace(/\s+/g, '_')}`;

    try {
      const response = await RNFetchBlob.fetch(
        'POST',
        `${SERVER_URL}/api/auth/upload`,
        { 'Content-Type': 'multipart/form-data' },
        [
          { name: 'projectName', data: selectedProject },
          { name: 'floorName', data: selectedFloor },
          { name: 'timestamp', data: timestamp },
          { name: 'video', filename: formattedFileName, type: 'video/mp4', data: RNFetchBlob.wrap(videoUri) },
        ],
      );

      const result = await response.json();
      setDownloadUrl(result.link);
      Alert.alert('Success', `Uploaded to Drive: ${result.link}`);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Something went wrong.');
    } finally {
      setIsUploading(false); // Reset uploading state after completion
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f7f7f7' }]}>
      {/* Selection Area */}
      <View style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Select Project & Floor</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={[styles.label, { color: isDarkMode ? '#bbb' : '#555' }]}>Project:</Text>
            <Picker
              selectedValue={selectedProject}
              onValueChange={itemValue => setSelectedProject(itemValue)}
              style={[styles.picker, { color: isDarkMode ? '#fff' : '#000' }]}
              dropdownIconColor={isDarkMode ? '#fff' : '#000'}>
              <Picker.Item label="Select Project" value="" color={isDarkMode ? '#bbb' : '#333'} />
              <Picker.Item label="Project 1" value="Project1" color={isDarkMode ? '#fff' : '#000'} />
              <Picker.Item label="Project 2" value="Project2" color={isDarkMode ? '#fff' : '#000'} />
              <Picker.Item label="Project 3" value="Project3" color={isDarkMode ? '#fff' : '#000'} />
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Text style={[styles.label, { color: isDarkMode ? '#bbb' : '#555' }]}>Floor:</Text>
            <Picker
              selectedValue={selectedFloor}
              onValueChange={itemValue => setSelectedFloor(itemValue)}
              style={[styles.picker, { color: isDarkMode ? '#fff' : '#000' }]}
              dropdownIconColor={isDarkMode ? '#fff' : '#000'}>
              <Picker.Item label="Select Floor" value="" color={isDarkMode ? '#bbb' : '#333'} />
              <Picker.Item label="Floor 1" value="Floor1" color={isDarkMode ? '#fff' : '#000'} />
              <Picker.Item label="Floor 2" value="Floor2" color={isDarkMode ? '#fff' : '#000'} />
              <Picker.Item label="Floor 3" value="Floor3" color={isDarkMode ? '#fff' : '#000'} />
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={pickVideo}>
        <Text style={styles.buttonText}>Pick a Video</Text>
      </TouchableOpacity>

      {videoUri && (
        <Text style={[styles.videoText, { color: isDarkMode ? '#fff' : '#000' }]}>📁 {videoName}</Text>
      )}

      <TouchableOpacity
        style={[styles.uploadButton, isUploading && { backgroundColor: '#ccc' }]} 
        onPress={uploadVideo}
        disabled={isUploading}>
        <Text style={styles.buttonText}>
          {isUploading ? 'Uploading...' : 'Upload to Google Drive'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: 'transparent',
  },
  videoText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

