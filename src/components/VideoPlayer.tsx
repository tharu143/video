// src/components/VideoPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Image, Alert, ActivityIndicator } from 'react-native';
// OnErrorData, OnLoadData, and OnBufferData types-ah import panrom
import Video, { VideoRef, OnLoadData, OnErrorData, OnBufferData } from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { VideoData } from '../types/types';
import { firebaseAuth, firestoreDb } from '../config/firebase';
import { doc, onSnapshot, deleteDoc, setDoc, updateDoc, increment, serverTimestamp } from '@react-native-firebase/firestore';

const { height, width } = Dimensions.get('window');

interface VideoPlayerProps {
  videoData: VideoData;
  isPaused: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoData, isPaused }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(videoData.likeCount || 0);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<VideoRef>(null);
  const likeAnimation = useRef(new Animated.Value(1)).current;
  const userId = firebaseAuth.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      const userLikeRef = doc(firestoreDb, 'users', userId, 'likedVideos', videoData.id);
      const unsubscribe = onSnapshot(userLikeRef, (documentSnapshot) => {
        setIsLiked(documentSnapshot.exists());
      });
      return () => unsubscribe();
    }
  }, [userId, videoData.id]);

  const handleLike = async () => {
    if (!userId) return;

    likeAnimation.setValue(0.7);
    Animated.spring(likeAnimation, {
      toValue: 1,
      friction: 2,
      useNativeDriver: true,
    }).start();

    const videoDocRef = doc(firestoreDb, 'videos', videoData.id);
    const userLikeRef = doc(firestoreDb, 'users', userId, 'likedVideos', videoData.id);

    if (isLiked) {
      setLikes(prev => prev - 1);
      await deleteDoc(userLikeRef);
      await updateDoc(videoDocRef, { likeCount: increment(-1) });
    } else {
      setLikes(prev => prev + 1);
      await setDoc(userLikeRef, { likedAt: serverTimestamp() });
      await updateDoc(videoDocRef, { likeCount: increment(1) });
    }
  };

  const onVideoError = (error: OnErrorData) => {
    console.error(`--- VIDEO ERROR for URL: ${videoData.url} ---`);
    console.error(JSON.stringify(error, null, 2));
    Alert.alert('Video Playback Error', `Could not play video. Error: ${error.error?.localizedFailureReason || 'Unknown'}`);
    setIsLoading(false);
  };

  const onVideoLoadStart = () => {
    setIsLoading(true);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
  };

  const onBuffer = (buffer: OnBufferData) => {
    setIsLoading(buffer.isBuffering);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setIsMuted(!isMuted)} style={StyleSheet.absoluteFill}>
        <Video
          ref={videoRef}
          source={{ uri: videoData.url }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={isPaused}
          muted={isMuted}
          playInBackground={false}
          playWhenInactive={false}
          onError={onVideoError}
          onLoadStart={onVideoLoadStart}
          onReadyForDisplay={onReadyForDisplay}
          onBuffer={onBuffer}
        />
      </TouchableOpacity>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.gradientOverlay}
      >
        <View style={styles.contentContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.username}>{videoData.user.name}</Text>
            <Text style={styles.description} numberOfLines={2}>{videoData.description}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Image source={{ uri: videoData.user.avatar }} style={styles.avatar} />
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
                <Icon name={isLiked ? 'heart' : 'heart-outline'} size={35} color={isLiked ? '#ff0050' : '#fff'} />
              </Animated.View>
              <Text style={styles.actionText}>{likes.toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcon name="comment-processing-outline" size={35} color="#fff" />
              <Text style={styles.actionText}>1,234</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcon name="share-outline" size={35} color="#fff" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {isMuted && !isLoading && (
        <View style={styles.muteIconContainer}>
          <Icon name="volume-mute" size={24} color="#fff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: width, height: height, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  video: { ...StyleSheet.absoluteFillObject },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 100 },
  contentContainer: { padding: 15, paddingBottom: 90, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  leftContainer: { flex: 4, justifyContent: 'flex-end' },
  username: { color: '#fff', fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  description: { color: '#fff', fontSize: 14, marginTop: 5, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  rightContainer: { flex: 1, alignItems: 'center', justifyContent: 'space-around' },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff', marginBottom: 25 },
  actionButton: { alignItems: 'center', marginBottom: 25 },
  actionText: { color: '#fff', fontSize: 12, marginTop: 5, fontWeight: '600' },
  muteIconContainer: { position: 'absolute', top: 60, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 30 },
});

export default VideoPlayer;
