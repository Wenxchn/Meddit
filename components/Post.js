import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import COLORS from '../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system'

const Post = ({ data, index, navigation }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [numLikes, setNumLikes] = useState(0)
  const [numComments, setNumComments] = useState(0)

  useEffect(() => {
    const init = async () => {
      try {
        const backend = await AsyncStorage.getItem('posts')
        const currentPost = JSON.parse(backend)[index]
        setNumLikes(currentPost.num_hugs)
        const numComments = Object.values(currentPost.comments).length
        setNumComments(numComments)
      } catch (e) {}
    }
    init()
  }, [])

  const updateNumLikes = async () => {
    try {
      const backend = await AsyncStorage.getItem('posts')
      let posts = JSON.parse(backend)
      let currentPost = posts[index]
      currentPost.num_hugs = currentPost.num_hugs + 1
      setIsLiked(true)
      setNumLikes(currentPost.num_hugs)
      posts[index] = currentPost
      await AsyncStorage.setItem('posts', JSON.stringify(posts))
    } catch (e) {}
  }

  const seeComments = async () => {
    try {
      await navigation.navigate('CommentSection', { index: index })
    } catch (e) {}
  }

  return (
    <View>
      <View style={styles.post}>
        <Pressable onPress={() => seeComments()}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description} numberOfLines={3}>
            {data.patient_description}
          </Text>
        </Pressable>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.likeButton} onPress={() => updateNumLikes()}>
            <Ionicons
              name="heart"
              size={24}
              color={isLiked ? COLORS.customPink : COLORS.customGrey}
            />
            <Text style={styles.likeText}>{`${numLikes} Hugs`}</Text>
          </Pressable>
          <Pressable style={styles.commentButton} onPress={() => seeComments()}>
            <Ionicons name="chatbox-ellipses" size={24} color={'black'} />
            <Text style={styles.likeText}>{`${numComments} Comments`}</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  post: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingVertical: '5%',
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '30%',
  },
  likeText: { marginLeft: 5 },
  commentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.customGrey,
  },
})

export default Post
