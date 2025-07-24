// src/screens/HomeScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import { FlatList, Dimensions, View, StyleSheet } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import { VideoData } from '../types/types';
// Pudhu file-la irundhu videoData-va import panrom
import { videoData } from '../data/videos';

const { height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  // Ippo videos state thevai illa, direct-ah hardcoded data-va use panrom
  const [currentlyVisibleId, setCurrentlyVisibleId] = useState<string | null>(videoData[0]?.id || null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<{ item: VideoData; isViewable: boolean }> }) => {
    if (viewableItems.length > 0) {
      setCurrentlyVisibleId(viewableItems[0].item.id);
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={videoData} // Hardcoded data-va inga use panrom
        renderItem={({ item }) => (
          <VideoPlayer
            videoData={item}
            isPaused={currentlyVisibleId !== item.id}
          />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default HomeScreen;
