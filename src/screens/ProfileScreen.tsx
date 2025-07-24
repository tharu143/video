// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { firebaseAuth, firestoreDb } from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserData, VideoData } from '../types/types';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, onSnapshot } from '@react-native-firebase/firestore';
// Hardcoded video data-va import panrom
import { videoData } from '../data/videos';

const { width } = Dimensions.get('window');
const videoThumbnailSize = width / 3;

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [likedVideos, setLikedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      const userDocRef = doc(firestoreDb, 'users', currentUser.uid);
      const userSubscriber = onSnapshot(userDocRef, (doc) => {
        setUser(doc.data() as UserData);
      });

      const likedVideosColRef = collection(firestoreDb, 'users', currentUser.uid, 'likedVideos');
      const likedVideosSubscriber = onSnapshot(likedVideosColRef, (snapshot) => {
        const likedVideoIds = snapshot.docs.map(doc => doc.id);
        
        // Liked IDs-ah vechu, namma hardcoded data-la irundhu videos-ah filter panrom
        const filteredVideos = videoData.filter(video => likedVideoIds.includes(video.id));
        
        setLikedVideos(filteredVideos);
        setLoading(false);
      });

      return () => {
        userSubscriber();
        likedVideosSubscriber();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const renderVideoThumbnail = ({ item }: { item: VideoData }) => (
    <TouchableOpacity style={styles.thumbnailContainer}>
      <Image 
        source={{ uri: item.user.avatar }} 
        style={styles.thumbnail} 
      />
      <View style={styles.thumbnailOverlay}>
        <Icon name="heart" size={14} color="#fff" />
        <Text style={styles.thumbnailLikes}>{item.likeCount ? item.likeCount.toLocaleString() : '0'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {user && (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{user.displayName}</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Icon name="logout" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfoContainer}>
              <Image source={{ uri: user.photoURL || 'https://i.pravatar.cc/150' }} style={styles.profileImage} />
              <View style={styles.statsContainer}>
                <View style={styles.stat}><Text style={styles.statNumber}>15</Text><Text style={styles.statLabel}>Following</Text></View>
                <View style={styles.stat}><Text style={styles.statNumber}>1.2M</Text><Text style={styles.statLabel}>Followers</Text></View>
                <View style={styles.stat}><Text style={styles.statNumber}>25.4M</Text><Text style={styles.statLabel}>Likes</Text></View>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
        
        <FlatList
          data={likedVideos}
          renderItem={renderVideoThumbnail}
          keyExtractor={item => item.id}
          numColumns={3}
          style={styles.grid}
          ListEmptyComponent={
            <View style={styles.placeholderContainer}>
              <Icon name="heart-off" size={40} color="gray" />
              <Text style={styles.placeholderText}>You haven't liked any videos yet.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  profileInfoContainer: { alignItems: 'center', marginTop: 10 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 25 },
  stat: { alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: 'gray', fontSize: 14, marginTop: 4 },
  editProfileButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 8, marginTop: 20 },
  editProfileButtonText: { color: '#fff', fontWeight: '600' },
  grid: { width: '100%', marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)' },
  thumbnailContainer: { width: videoThumbnailSize, height: videoThumbnailSize * 1.5, backgroundColor: '#333', borderWidth: 1, borderColor: 'rgba(0,0,0,0.5)' },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailOverlay: { position: 'absolute', bottom: 5, left: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 4, borderRadius: 4 },
  thumbnailLikes: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: 'bold' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  placeholderText: { color: 'gray', marginTop: 10 },
});

export default ProfileScreen;
