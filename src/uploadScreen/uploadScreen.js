import React, { useState } from 'react';
import { View, Button, Text, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { SERVER_URL } from '../../../appConstants';
import RNFetchBlob from 'react-native-blob-util';
import { Picker } from '@react-native-picker/picker';

export default function UploadScreen (navigation, route){
  const [videoUri, setVideoUri] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null); // Store the uploaded video link

  // Function to Pick Video
  const pickVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
        allowMultiSelection: false,
      });

      if (res && res.length > 0) {
        setVideoUri(res[0].uri);
        setVideoName(res[0].name);
        console.log('Selected Video URI:', res[0].uri);
      } else {
        console.log('No file selected');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Error picking video:', err);
      }
    }
  };

  // Function to Upload Video to Backend
  const uploadVideo = async () => {
    if (!videoUri || !selectedProject || !selectedFloor) {
      Alert.alert('Please select project, floor, and video before uploading!');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    const extractedOriginalName = videoName.replace(/\s+/g, '_'); // Ensure clean name
    const formattedFileName = `${selectedProject}-${selectedFloor}-${timestamp}_VID_${extractedOriginalName}`;

    try {
      const response = await RNFetchBlob.fetch(
        'POST',
        `${SERVER_URL}/api/auth/upload`,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          { name: 'projectName', data: selectedProject },
          { name: 'floorName', data: selectedFloor },
          { name: 'timestamp', data: timestamp },
          {
            name: 'video',
            filename: formattedFileName,
            type: 'video/mp4',
            data: RNFetchBlob.wrap(videoUri),
          },
        ]
      );

      const result = await response.json();
      console.log('Video uploaded to Drive:', result.link);
      setDownloadUrl(result.link); // Store the download link
      Alert.alert('Upload Success', `Video uploaded to Drive: ${result.link}`);

      // Automatically download the uploaded video
      downloadVideo(result.link, formattedFileName);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Something went wrong.');
    }
  };

  // Function to Download Video
  const downloadVideo = async (url, fileName) => {
    if (!url) {
      Alert.alert('Download Failed', 'No download link available.');
      return;
    }

    const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;

    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4',
      path: filePath, // Save in Downloads folder
    })
      .fetch('GET', url)
      .then((res) => {
        console.log('Download complete:', res.path());
        Alert.alert('Download Complete', `Video saved at: ${res.path()}`);
      })
      .catch((error) => {
        console.error('Download error:', error);
        Alert.alert('Download Failed', 'Something went wrong.');
      });
  };

  return (
    <View style={styles.container}>
      {/* Dropdowns Side by Side */}
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Select Project:</Text>
          <Picker
            selectedValue={selectedProject}
            onValueChange={(itemValue) => setSelectedProject(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Select Project" value="" color="gray" />
            <Picker.Item label="Project 1" value="Project1" color="#fff" />
            <Picker.Item label="Project 2" value="Project2" color="#fff" />
            <Picker.Item label="Project 3" value="Project3" color="#fff" />
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Select Floor:</Text>
          <Picker
            selectedValue={selectedFloor}
            onValueChange={(itemValue) => setSelectedFloor(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Select Floor" value="" color="gray" />
            <Picker.Item label="Floor 1" value="Floor1" color="#fff" />
            <Picker.Item label="Floor 2" value="Floor2" color="#fff" />
            <Picker.Item label="Floor 3" value="Floor3" color="#fff" />
          </Picker>
        </View>
      </View>

      <Button title="Pick a Video" onPress={pickVideo} />
      {videoUri && <Text style={styles.videoText}>Selected Video: {videoName}</Text>}
      <Button title="Upload to Google Drive" onPress={uploadVideo} color="green" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  picker: {
    backgroundColor: '#fff',
    color: '#000',
  },
  videoText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

