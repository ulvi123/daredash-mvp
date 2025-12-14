// // import { format } from 'date-fns';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { useRouter } from 'expo-router'; // Add this import
// // import { collection, getDocs, query, where } from 'firebase/firestore';
// // import React, { useEffect, useState } from 'react';
// // import { Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// // import { useAuth } from '../../contexts/AuthContext';
// // import { Collections } from '../../services/firebase/collections';
// // import { db } from '../../services/firebase/config';
// // import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';


// // const { width } = Dimensions.get('window');

// // const ProfileScreen = () => {
// //   const { user, signOut } = useAuth();  // Add signOut here
// //   const router = useRouter();  // Add router
// //   const [userCompletions, setUserCompletions] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showLogoutModal, setShowLogoutModal] = useState(false);



// //   useEffect(() => {
// //     loadUserCompletions();
// //   });

// //   const loadUserCompletions = async () => {
// //     if (!user?.id) return;  // Changed from user?.uid to user?.id

// //     try {
// //       const q = query(
// //         collection(db, Collections.COMPLETIONS),
// //         where('userId', '==', user.id)  // Changed from user.uid to user.id
// //       );
// //       const snapshot = await getDocs(q);
// //       const data = snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data(),
// //         submittedAt: doc.data().submittedAt?.toDate() || new Date(),
// //       }));
// //       setUserCompletions(data);
// //     } catch (error) {
// //       console.error('Error fetching profile data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Add logout handler
// //   const handleLogout = () => {
// //     console.log("⚠️ LOGOUT MODAL OPENED");
// //     setShowLogoutModal(true);
// //   };

// //   const confirmLogout = async () => {
// //     console.log("🟡 Logout pressed");

// //     try {
// //       await signOut();
// //       console.log("🟢 Firebase signed out");

// //       router.replace("/login");
// //       console.log("🔵 Redirected");
// //     } catch (err) {
// //       console.error("🔴 Logout error:", err);
// //     }
// //   };



// //   const totalRewards = userCompletions.reduce((sum, c) => sum + (c.rewardAmount || 0), 0);

// //   return (
// //     <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.container}>

// //       {/* --- LOGOUT MODAL (Step 4) --- */}
// //       {showLogoutModal && (
// //         <View style={{
// //           position: "absolute",
// //           top: 0, left: 0, right: 0, bottom: 0,
// //           backgroundColor: "rgba(0,0,0,0.5)",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           padding: 20,
// //           zIndex: 999,
// //         }}>
// //           <View style={{
// //             backgroundColor: "#fff",
// //             padding: 20,
// //             borderRadius: 16,
// //             width: "90%",
// //             maxWidth: 350,
// //           }}>
// //             <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
// //               Log Out
// //             </Text>

// //             <Text style={{ marginBottom: 20 }}>
// //               Are you sure you want to log out?
// //             </Text>

// //             <TouchableOpacity
// //               onPress={confirmLogout}
// //               style={{
// //                 backgroundColor: "red",
// //                 padding: 12,
// //                 alignItems: "center",
// //                 borderRadius: 10,
// //                 marginBottom: 10,
// //               }}>
// //               <Text style={{ color: "#fff", fontWeight: "bold" }}>Log Out</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               onPress={() => setShowLogoutModal(false)}
// //               style={{
// //                 backgroundColor: "#ddd",
// //                 padding: 12,
// //                 alignItems: "center",
// //                 borderRadius: 10,
// //               }}>
// //               <Text style={{ fontWeight: "bold" }}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       )}
// //       {/* --- END MODAL --- */}


// //       {/* Header Section */}
// //       <View style={styles.header}>
// //         <View style={styles.avatarContainer}>
// //           <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.avatarBorder}>
// //             <View style={styles.avatar}>
// //               <Text style={styles.avatarText}>
// //                 {user?.displayName?.charAt(0).toUpperCase() || 'U'}
// //               </Text>
// //             </View>
// //           </LinearGradient>
// //         </View>

// //         <View style={styles.userInfo}>
// //           <Text style={styles.userName}>{user?.displayName || 'Anonymous User'}</Text>
// //           <Text style={styles.userSince}>
// //             Joined {format(user?.createdAt || new Date(), 'MMM yyyy')}
// //           </Text>
// //         </View>
// //       </View>

// //       {/* Stats Section */}
// //       <View style={styles.statsContainer}>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statValue}>{user?.challengesCompleted || 0}</Text>
// //           <Text style={styles.statLabel}>Completions</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statValue}>{user?.dcoinsLifeTimeEarned || 0}</Text>
// //           <Text style={styles.statLabel}>DC Earned</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statValue}>{user?.reputation || 0}</Text>
// //           <Text style={styles.statLabel}>Reputation</Text>
// //         </View>
// //       </View>

// //       {/* Balance Card */}
// //       <View style={styles.balanceCard}>
// //         <Text style={styles.balanceLabel}>Current Balance</Text>
// //         <View style={styles.balanceRow}>
// //           <Text style={styles.balanceEmoji}>🪙</Text>
// //           <Text style={styles.balanceValue}>{user?.dcoins || 0} DC</Text>
// //         </View>
// //         <Pressable
// //           style={styles.addFundsButton}
// //           onPress={() => router.push('/purchase-tokens')}
// //         >
// //           <Text style={styles.addFundsText}>+ Add DCoins</Text>
// //         </Pressable>
// //       </View>

// //       {/* Recent Completions */}
// //       <Text style={styles.sectionTitle}>Recent Completions</Text>

// //       {userCompletions.length > 0 ? (
// //         <FlatList
// //           data={userCompletions}
// //           horizontal
// //           keyExtractor={(item) => item.id}
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
// //           renderItem={({ item }) => (
// //             <View style={styles.completionCard}>
// //               <LinearGradient
// //                 colors={[Colors.surface, Colors.background]}
// //                 style={styles.completionGradient}
// //               >
// //                 <View style={styles.completionIconContainer}>
// //                   <Text style={styles.completionIcon}>🎥</Text>
// //                 </View>
// //                 <Text style={styles.completionTitle} numberOfLines={1}>
// //                   {item.caption || 'Untitled Completion'}
// //                 </Text>
// //                 <Text style={styles.completionDate}>
// //                   {format(item.submittedAt, 'MMM d, yyyy')}
// //                 </Text>
// //                 <View style={styles.completionReward}>
// //                   <Text style={styles.rewardEmoji}>🪙</Text>
// //                   <Text style={styles.rewardText}>{item.rewardAmount || 0} DC</Text>
// //                 </View>
// //               </LinearGradient>
// //             </View>
// //           )}
// //         />
// //       ) : (
// //         <View style={styles.emptyState}>
// //           <Text style={styles.emptyText}>No completions yet</Text>
// //           <Text style={styles.emptySubtext}>
// //             Start completing challenges to see them here!
// //           </Text>
// //         </View>
// //       )}

// //       {/* Edit Profile / Settings */}
// //       <View style={styles.bottomButtons}>
// //         <Pressable style={styles.button}>
// //           <Text style={styles.buttonText}>Edit Profile</Text>
// //         </Pressable>

// //         <TouchableOpacity
// //           style={[styles.button, styles.secondaryButton]}
// //           onPress={handleLogout}
// //         >
// //           <Text style={styles.secondaryButtonText}>Log Out</Text>
// //         </TouchableOpacity>
// //       </View>

// //     </LinearGradient>
// //   );

// // };

// // export default ProfileScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     paddingVertical: Spacing.xl,
// //     paddingTop: 60,  // Add top padding for status bar
// //   },
// //   avatarContainer: {
// //     marginBottom: Spacing.md,
// //   },
// //   avatarBorder: {
// //     width: 110,
// //     height: 110,
// //     borderRadius: 55,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 3,
// //   },
// //   avatar: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: Colors.surface,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   avatarText: {
// //     fontSize: 40,
// //     fontWeight: '800',
// //     color: Colors.primary,
// //   },
// //   userInfo: {
// //     alignItems: 'center',
// //   },
// //   userName: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: Colors.text,
// //   },
// //   userSince: {
// //     fontSize: 14,
// //     color: Colors.textSecondary,
// //     marginTop: 2,
// //   },
// //   statsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     paddingVertical: Spacing.lg,
// //     backgroundColor: Colors.surface,
// //     borderRadius: BorderRadius.lg,
// //     marginHorizontal: Spacing.lg,
// //     marginBottom: Spacing.lg,
// //   },
// //   statCard: {
// //     alignItems: 'center',
// //   },
// //   statValue: {
// //     fontSize: 20,
// //     fontWeight: '800',
// //     color: Colors.primary,
// //   },
// //   statLabel: {
// //     fontSize: 12,
// //     color: Colors.textSecondary,
// //     marginTop: 2,
// //   },
// //   balanceCard: {
// //     backgroundColor: Colors.surface,
// //     borderRadius: BorderRadius.lg,
// //     padding: Spacing.lg,
// //     marginHorizontal: Spacing.lg,
// //     marginBottom: Spacing.lg,
// //     alignItems: 'center',
// //   },
// //   balanceLabel: {
// //     fontSize: 14,
// //     color: Colors.textSecondary,
// //     marginBottom: Spacing.sm,
// //   },
// //   balanceRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: Spacing.md,
// //   },
// //   balanceEmoji: {
// //     fontSize: 32,
// //     marginRight: Spacing.sm,
// //   },
// //   balanceValue: {
// //     fontSize: 32,
// //     fontWeight: '800',
// //     color: Colors.primary,
// //   },
// //   addFundsButton: {
// //     backgroundColor: Colors.primary,
// //     paddingHorizontal: Spacing.lg,
// //     paddingVertical: Spacing.sm,
// //     borderRadius: BorderRadius.full,
// //   },
// //   addFundsText: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: Colors.text,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: Colors.text,
// //     marginLeft: Spacing.lg,
// //     marginBottom: Spacing.md,
// //   },
// //   completionCard: {
// //     width: width * 0.55,
// //     height: 180,
// //     borderRadius: BorderRadius.lg,
// //     marginRight: Spacing.md,
// //     overflow: 'hidden',
// //   },
// //   completionGradient: {
// //     flex: 1,
// //     padding: Spacing.md,
// //     justifyContent: 'space-between',
// //   },
// //   completionIconContainer: {
// //     alignItems: 'center',
// //   },
// //   completionIcon: {
// //     fontSize: 50,
// //   },
// //   completionTitle: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: Colors.text,
// //   },
// //   completionDate: {
// //     fontSize: 12,
// //     color: Colors.textSecondary,
// //   },
// //   completionReward: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   rewardEmoji: {
// //     fontSize: 14,
// //     marginRight: 4,
// //   },
// //   rewardText: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: Colors.success,
// //   },
// //   emptyState: {
// //     alignItems: 'center',
// //     paddingVertical: Spacing.xxl,
// //     paddingHorizontal: Spacing.lg,
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: Colors.textSecondary,
// //     marginBottom: Spacing.xs,
// //   },
// //   emptySubtext: {
// //     fontSize: 14,
// //     color: Colors.textMuted,
// //     textAlign: 'center',
// //   },
// //   bottomButtons: {
// //     marginTop: Spacing.xl,
// //     paddingHorizontal: Spacing.lg,
// //     paddingBottom: Spacing.xl,
// //   },
// //   button: {
// //     backgroundColor: Colors.primary,
// //     paddingVertical: Spacing.md,
// //     borderRadius: BorderRadius.full,
// //     alignItems: 'center',
// //     marginBottom: Spacing.md,
// //   },
// //   buttonText: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: Colors.text,
// //   },
// //   secondaryButton: {
// //     backgroundColor: 'transparent',
// //     borderWidth: 1,
// //     borderColor: Colors.danger,
// //   },
// //   secondaryButtonText: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: Colors.danger,
// //   },
// // });

// import { format } from 'date-fns';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import React, { useEffect, useRef, useState } from 'react';
// import { 
//   Dimensions, 
//   FlatList, 
//   Pressable, 
//   StyleSheet, 
//   Text, 
//   TouchableOpacity, 
//   View,
//   ScrollView,
//   Share,
//   Alert,
//   Animated
// } from 'react-native';
// import { useAuth } from '../../contexts/AuthContext';
// import { Collections } from '../../services/firebase/collections';
// import { db } from '../../services/firebase/config';
// import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';
// import * as Sharing from 'expo-sharing';
// import ViewShot from 'react-native-view-shot';

// const { width, height } = Dimensions.get('window');

// const ProfileScreen = () => {
//   const { user, signOut } = useAuth();
//   const router = useRouter();
//   const [userCompletions, setUserCompletions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [selectedCompletion, setSelectedCompletion] = useState<any>(null);
//   const shareCardRef = useRef(null);
//   const bounceAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     loadUserCompletions();
//   }, []);

//   const loadUserCompletions = async () => {
//     if (!user?.id) return;

//     try {
//       const q = query(
//         collection(db, Collections.COMPLETIONS),
//         where('userId', '==', user.id)
//       );
//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         submittedAt: doc.data().submittedAt?.toDate() || new Date(),
//       }));
//       setUserCompletions(data.sort((a, b) => b.submittedAt - a.submittedAt));
//     } catch (error) {
//       console.error('Error fetching profile data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     setShowLogoutModal(true);
//   };

//   const confirmLogout = async () => {
//     try {
//       await signOut();
//       router.replace("/login");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   // VIRAL SHARING FUNCTIONS
//   const handleShareCompletion = async (completion: any) => {
//     setSelectedCompletion(completion);
//     setShowShareModal(true);
//   };

//   const shareToSocial = async () => {
//     try {
//       // Create shareable message
//       const message = `🎉 Just completed a challenge on DareDash!\n\n💰 Earned ${selectedCompletion.rewardAmount || 0} DC\n🏆 Total: ${user?.challengesCompleted || 0} completions\n\nThink you can do better? Join me: [Your App Link]`;
      
//       await Share.share({
//         message,
//         title: 'My DareDash Achievement',
//       });

//       // Bonus DC for sharing (optional)
//       Alert.alert('Bonus!', '+5 DC for sharing! 🎁');
//     } catch (error) {
//       console.error('Error sharing:', error);
//     }
//   };

//   const challengeFriend = () => {
//     // Navigate to friend challenge screen or show friend selector
//     Alert.alert(
//       'Challenge Friends', 
//       'Select friends to challenge them to complete this!',
//       [
//         { text: 'Invite Friends', onPress: () => shareToSocial() },
//         { text: 'Cancel', style: 'cancel' }
//       ]
//     );
//   };

//   const getStreakEmoji = (count: number) => {
//     if (count >= 30) return '🔥🔥🔥';
//     if (count >= 7) return '🔥🔥';
//     if (count >= 3) return '🔥';
//     return '⭐';
//   };

//   const getRankBadge = (completions: number) => {
//     if (completions >= 100) return { emoji: '👑', text: 'Legend', color: '#FFD700' };
//     if (completions >= 50) return { emoji: '💎', text: 'Diamond', color: '#00D4FF' };
//     if (completions >= 25) return { emoji: '🏆', text: 'Gold', color: '#FFB800' };
//     if (completions >= 10) return { emoji: '🥈', text: 'Silver', color: '#C0C0C0' };
//     return { emoji: '🌟', text: 'Rising Star', color: '#4CAF50' };
//   };

//   const totalRewards = userCompletions.reduce((sum, c) => sum + (c.rewardAmount || 0), 0);
//   const rank = getRankBadge(user?.challengesCompleted || 0);

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.gradient}>
//         <ScrollView 
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Settings Icon for Logout */}
//           <TouchableOpacity 
//             style={styles.settingsButton}
//             onPress={handleLogout}
//           >
//             <Text style={styles.settingsIcon}>⚙️</Text>
//           </TouchableOpacity>

//           {/* Header Section with Rank Badge */}
//           <View style={styles.header}>
//             <View style={styles.avatarContainer}>
//               <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.avatarBorder}>
//                 <View style={styles.avatar}>
//                   <Text style={styles.avatarText}>
//                     {user?.displayName?.charAt(0).toUpperCase() || 'U'}
//                   </Text>
//                 </View>
//               </LinearGradient>
//               {/* Rank Badge Overlay */}
//               <View style={[styles.rankBadge, { backgroundColor: rank.color }]}>
//                 <Text style={styles.rankEmoji}>{rank.emoji}</Text>
//               </View>
//             </View>

//             <View style={styles.userInfo}>
//               <Text style={styles.userName}>{user?.displayName || 'Anonymous User'}</Text>
//               <Text style={styles.rankText}>{rank.text} Rank</Text>
//               <Text style={styles.userSince}>
//                 Joined {format(user?.createdAt || new Date(), 'MMM yyyy')}
//               </Text>
//             </View>
//           </View>

//           {/* Stats Section with Flex Appeal */}
//           <View style={styles.statsContainer}>
//             <TouchableOpacity 
//               style={styles.statCard}
//               onPress={() => {
//                 Animated.sequence([
//                   Animated.timing(bounceAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
//                   Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
//                 ]).start();
//               }}
//             >
//               <Text style={styles.statValue}>{user?.challengesCompleted || 0}</Text>
//               <Text style={styles.statLabel}>Completions</Text>
//               <Text style={styles.statFlex}>Top 15% 📈</Text>
//             </TouchableOpacity>
            
//             <View style={styles.statCard}>
//               <Text style={styles.statValue}>{user?.dcoinsLifeTimeEarned || 0}</Text>
//               <Text style={styles.statLabel}>DC Earned</Text>
//               <Text style={styles.statStreak}>
//                 {getStreakEmoji(user?.challengesCompleted || 0)} Streak
//               </Text>
//             </View>
            
//             <View style={styles.statCard}>
//               <Text style={styles.statValue}>{user?.reputation || 0}</Text>
//               <Text style={styles.statLabel}>Reputation</Text>
//             </View>
//           </View>

//           {/* Balance Card */}
//           <View style={styles.balanceCard}>
//             <Text style={styles.balanceLabel}>Current Balance</Text>
//             <View style={styles.balanceRow}>
//               <Text style={styles.balanceEmoji}>🪙</Text>
//               <Text style={styles.balanceValue}>{user?.dcoins || 0} DC</Text>
//             </View>
//             <Pressable
//               style={styles.addFundsButton}
//               onPress={() => router.push('/purchase-tokens')}
//             >
//               <Text style={styles.addFundsText}>+ Add DCoins</Text>
//             </Pressable>
//           </View>

//           {/* Share Your Stats CTA */}
//           <TouchableOpacity 
//             style={styles.shareStatsButton}
//             onPress={() => {
//               const message = `🎮 I've completed ${user?.challengesCompleted || 0} challenges on DareCoins!\n\n💰 ${user?.dcoinsLifeTimeEarned || 0} DC earned\n${rank.emoji} ${rank.text} Rank\n\nThink you can beat me? 😏\n[App Link]`;
//               Share.share({ message });
//             }}
//           >
//             <Text style={styles.shareStatsText}>📤 Share My Stats</Text>
//           </TouchableOpacity>

//           {/* Recent Completions */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Completions</Text>
//             <Text style={styles.sectionSubtitle}>Tap to share your wins! 🎉</Text>
//           </View>

//           {userCompletions.length > 0 ? (
//             <FlatList
//               data={userCompletions}
//               horizontal
//               keyExtractor={(item) => item.id}
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={styles.completionCard}
//                   onPress={() => handleShareCompletion(item)}
//                   activeOpacity={0.8}
//                 >
//                   <LinearGradient
//                     colors={['#667eea', '#764ba2']}
//                     style={styles.completionGradient}
//                   >
//                     <View style={styles.completionIconContainer}>
//                       <Text style={styles.completionIcon}>🎥</Text>
//                     </View>
//                     <Text style={styles.completionTitle} numberOfLines={2}>
//                       {item.caption || 'Untitled Completion'}
//                     </Text>
//                     <Text style={styles.completionDate}>
//                       {format(item.submittedAt, 'MMM d, yyyy')}
//                     </Text>
//                     <View style={styles.completionReward}>
//                       <Text style={styles.rewardEmoji}>🪙</Text>
//                       <Text style={styles.rewardText}>{item.rewardAmount || 0} DC</Text>
//                     </View>
//                     {/* Share Icon Hint */}
//                     <View style={styles.shareHint}>
//                       <Text style={styles.shareHintText}>📤 Tap to share</Text>
//                     </View>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               )}
//             />
//           ) : (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyText}>No completions yet</Text>
//               <Text style={styles.emptySubtext}>
//                 Start completing challenges to see them here!
//               </Text>
//             </View>
//           )}

//           {/* Padding for bottom tab bar */}
//           <View style={{ height: 100 }} />
//         </ScrollView>

//         {/* Share Modal */}
//         {showShareModal && selectedCompletion && (
//           <View style={styles.modalOverlay}>
//             <View style={styles.shareModal}>
//               {/* Shareable Card Preview */}
//               <LinearGradient
//                 colors={['#667eea', '#764ba2']}
//                 style={styles.shareCard}
//               >
//                 <View style={styles.shareCardHeader}>
//                   <Text style={styles.shareCardTitle}>🎉 Challenge Completed!</Text>
//                 </View>
                
//                 <View style={styles.shareCardContent}>
//                   <Text style={styles.shareCardChallenge}>
//                     {selectedCompletion.caption || 'Challenge'}
//                   </Text>
                  
//                   <View style={styles.shareCardStats}>
//                     <View style={styles.shareCardStat}>
//                       <Text style={styles.shareCardStatValue}>
//                         +{selectedCompletion.rewardAmount || 0}
//                       </Text>
//                       <Text style={styles.shareCardStatLabel}>🪙 DC Earned</Text>
//                     </View>
                    
//                     <View style={styles.shareCardStat}>
//                       <Text style={styles.shareCardStatValue}>
//                         {user?.challengesCompleted || 0}
//                       </Text>
//                       <Text style={styles.shareCardStatLabel}>🏆 Total</Text>
//                     </View>
//                   </View>

//                   <Text style={styles.shareCardUser}>
//                     by @{user?.displayName || 'user'}
//                   </Text>
//                 </View>

//                 <View style={styles.shareCardFooter}>
//                   <Text style={styles.shareCardCTA}>Think you can do better? 😏</Text>
//                   <Text style={styles.shareCardApp}>Join me on DareCoins</Text>
//                 </View>
//               </LinearGradient>

//               {/* Action Buttons */}
//               <TouchableOpacity 
//                 style={styles.shareActionButton}
//                 onPress={shareToSocial}
//               >
//                 <Text style={styles.shareActionText}>📤 Share to Social Media</Text>
//                 <Text style={styles.shareActionBonus}>+5 DC bonus!</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.shareActionButton, styles.challengeButton]}
//                 onPress={challengeFriend}
//               >
//                 <Text style={styles.shareActionText}>⚔️ Challenge a Friend</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.cancelButton}
//                 onPress={() => setShowShareModal(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* Logout Modal */}
//         {showLogoutModal && (
//           <View style={styles.modalOverlay}>
//             <View style={styles.logoutModal}>
//               <Text style={styles.modalTitle}>Log Out</Text>
//               <Text style={styles.modalText}>
//                 Are you sure you want to log out?
//               </Text>

//               <TouchableOpacity
//                 onPress={confirmLogout}
//                 style={styles.logoutButton}
//               >
//                 <Text style={styles.logoutButtonText}>Log Out</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setShowLogoutModal(false)}
//                 style={styles.cancelModalButton}
//               >
//                 <Text style={styles.cancelModalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </LinearGradient>
//     </View>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradient: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: Spacing.xl,
//   },
//   settingsButton: {
//     position: 'absolute',
//     top: 50,
//     right: Spacing.lg,
//     zIndex: 10,
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: Colors.surface,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   settingsIcon: {
//     fontSize: 22,
//   },
//   header: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xl,
//     paddingTop: 60,
//   },
//   avatarContainer: {
//     marginBottom: Spacing.md,
//     position: 'relative',
//   },
//   avatarBorder: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 3,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: Colors.surface,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarText: {
//     fontSize: 40,
//     fontWeight: '800',
//     color: Colors.primary,
//   },
//   rankBadge: {
//     position: 'absolute',
//     bottom: -5,
//     right: -5,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 3,
//     borderColor: Colors.background,
//   },
//   rankEmoji: {
//     fontSize: 20,
//   },
//   userInfo: {
//     alignItems: 'center',
//   },
//   userName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   rankText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.primary,
//     marginTop: 2,
//   },
//   userSince: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 2,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: Spacing.lg,
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     marginHorizontal: Spacing.lg,
//     marginBottom: Spacing.lg,
//   },
//   statCard: {
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: Colors.primary,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 2,
//   },
//   statFlex: {
//     fontSize: 10,
//     color: Colors.success,
//     marginTop: 4,
//     fontWeight: '600',
//   },
//   statStreak: {
//     fontSize: 10,
//     color: Colors.accent,
//     marginTop: 4,
//     fontWeight: '600',
//   },
//   balanceCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     marginHorizontal: Spacing.lg,
//     marginBottom: Spacing.md,
//     alignItems: 'center',
//   },
//   balanceLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.sm,
//   },
//   balanceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.md,
//   },
//   balanceEmoji: {
//     fontSize: 32,
//     marginRight: Spacing.sm,
//   },
//   balanceValue: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.primary,
//   },
//   addFundsButton: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.full,
//   },
//   addFundsText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   shareStatsButton: {
//     backgroundColor: '#667eea',
//     marginHorizontal: Spacing.lg,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.full,
//     alignItems: 'center',
//     marginBottom: Spacing.lg,
//   },
//   shareStatsText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   sectionHeader: {
//     marginHorizontal: Spacing.lg,
//     marginBottom: Spacing.md,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   sectionSubtitle: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 2,
//   },
//   completionCard: {
//     width: width * 0.55,
//     height: 200,
//     borderRadius: BorderRadius.lg,
//     marginRight: Spacing.md,
//     overflow: 'hidden',
//   },
//   completionGradient: {
//     flex: 1,
//     padding: Spacing.md,
//     justifyContent: 'space-between',
//   },
//   completionIconContainer: {
//     alignItems: 'center',
//   },
//   completionIcon: {
//     fontSize: 50,
//   },
//   completionTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   completionDate: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.8)',
//   },
//   completionReward: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rewardEmoji: {
//     fontSize: 14,
//     marginRight: 4,
//   },
//   rewardText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   shareHint: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   shareHintText: {
//     fontSize: 10,
//     color: '#fff',
//     fontWeight: '600',
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xxl,
//     paddingHorizontal: Spacing.lg,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.textSecondary,
//     marginBottom: Spacing.xs,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: Colors.textMuted,
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: Spacing.lg,
//     zIndex: 999,
//   },
//   shareModal: {
//     backgroundColor: Colors.surface,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     width: '100%',
//     maxWidth: 400,
//   },
//   shareCard: {
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.lg,
//     marginBottom: Spacing.lg,
//   },
//   shareCardHeader: {
//     alignItems: 'center',
//     marginBottom: Spacing.md,
//   },
//   shareCardTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: '#fff',
//   },
//   shareCardContent: {
//     alignItems: 'center',
//     paddingVertical: Spacing.lg,
//   },
//   shareCardChallenge: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: Spacing.lg,
//   },
//   shareCardStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: Spacing.md,
//   },
//   shareCardStat: {
//     alignItems: 'center',
//   },
//   shareCardStatValue: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#fff',
//   },
//   shareCardStatLabel: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 4,
//   },
//   shareCardUser: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.9)',
//     fontWeight: '600',
//   },
//   shareCardFooter: {
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255,255,255,0.2)',
//     paddingTop: Spacing.md,
//   },
//   shareCardCTA: {
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   shareCardApp: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.7)',
//   },
//   shareActionButton: {
//     backgroundColor: Colors.primary,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.full,
//     alignItems: 'center',
//     marginBottom: Spacing.md,
//   },
//   shareActionText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: Colors.text,
//   },
//   shareActionBonus: {
//     fontSize: 12,
//     color: Colors.success,
//     marginTop: 2,
//   },
//   challengeButton: {
//     backgroundColor: '#FF6B6B',
//   },
//   cancelButton: {
//     paddingVertical: Spacing.md,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//   },
//   logoutModal: {
//     backgroundColor: '#fff',
//     padding: Spacing.xl,
//     borderRadius: BorderRadius.lg,
//     width: '90%',
//     maxWidth: 350,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: Spacing.md,
//     color: Colors.text,
//   },
//   modalText: {
//     marginBottom: Spacing.lg,
//     color: Colors.textSecondary,
//   },
//   logoutButton: {
//     backgroundColor: Colors.danger,
//     padding: Spacing.md,
//     alignItems: 'center',
//     borderRadius: BorderRadius.md,
//     marginBottom: Spacing.sm,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   cancelModalButton: {
//     backgroundColor: '#ddd',
//     padding: Spacing.md,
//     alignItems: 'center',
//     borderRadius: BorderRadius.md,
//   },
//   cancelModalButtonText: {
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
// });


import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Dimensions, 
  FlatList, 
  Pressable, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ScrollView,
  Share,
  Alert,
  Animated
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../contexts/AuthContext';
import { Collections } from '../../services/firebase/collections';
import { db } from '../../services/firebase/config';
import { BorderRadius, Colors, Spacing } from '../../utils/constants/themes';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [userCompletions, setUserCompletions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCompletion, setSelectedCompletion] = useState<any>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUserCompletions();
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for rank badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous rotation for settings icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const loadUserCompletions = async () => {
    if (!user?.id) return;

    try {
      const q = query(
        collection(db, Collections.COMPLETIONS),
        where('userId', '==', user.id)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
      }));
      setUserCompletions(data.sort((a, b) => b.submittedAt - a.submittedAt));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleShareCompletion = async (completion: any) => {
    setSelectedCompletion(completion);
    setShowShareModal(true);
  };

  const shareToSocial = async () => {
    try {
      const message = `🎉 Just completed a challenge on DareCoins!\n\n💰 Earned ${selectedCompletion.rewardAmount || 0} DC\n🏆 Total: ${user?.challengesCompleted || 0} completions\n\nThink you can do better? Join me: [Your App Link]`;
      
      await Share.share({
        message,
        title: 'My DareCoins Achievement',
      });

      Alert.alert('Bonus!', '+5 DC for sharing! 🎁');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const challengeFriend = () => {
    Alert.alert(
      'Challenge Friends', 
      'Select friends to challenge them to complete this!',
      [
        { text: 'Invite Friends', onPress: () => shareToSocial() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const getStreakEmoji = (count: number) => {
    if (count >= 30) return '🔥🔥🔥';
    if (count >= 7) return '🔥🔥';
    if (count >= 3) return '🔥';
    return '⭐';
  };

  const getRankBadge = (completions: number): { emoji: string; text: string; color: string; gradient: [string, string] } => {
    if (completions >= 100) return { emoji: '👑', text: 'Legend', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] as [string, string] };
    if (completions >= 50) return { emoji: '💎', text: 'Diamond', color: '#00D4FF', gradient: ['#00D4FF', '#0099FF'] as [string, string] };
    if (completions >= 25) return { emoji: '🏆', text: 'Gold', color: '#FFB800', gradient: ['#FFB800', '#FF8C00'] as [string, string] };
    if (completions >= 10) return { emoji: '🥈', text: 'Silver', color: '#C0C0C0', gradient: ['#E8E8E8', '#A0A0A0'] as [string, string] };
    return { emoji: '🌟', text: 'Rising Star', color: '#4CAF50', gradient: ['#4CAF50', '#45A049'] as [string, string] };
  };

  const rank = getRankBadge(user?.challengesCompleted || 0);
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#0F0C29', '#302b63', '#24243e']} 
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Animated Settings Button */}
          <Animated.View style={[
            styles.settingsButton,
            { transform: [{ rotate: spin }] }
          ]}>
            <TouchableOpacity 
              onPress={handleLogout}
              style={styles.settingsButtonInner}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.settingsGradient}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Hero Header with Glassmorphism */}
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}>
            {/* Floating particles background */}
            <View style={styles.particlesContainer}>
              {[...Array(20)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.particle,
                    {
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: Math.random() * 4 + 2,
                      height: Math.random() * 4 + 2,
                      opacity: Math.random() * 0.5 + 0.3,
                    }
                  ]}
                />
              ))}
            </View>

            {/* Avatar with 3D effect */}
            <View style={styles.avatarContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <LinearGradient 
                  colors={rank.gradient} 
                  style={styles.avatarBorder}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.avatarInner}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.avatar}
                    >
                      <Text style={styles.avatarText}>
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    </LinearGradient>
                  </View>
                </LinearGradient>
              </Animated.View>
              
              {/* 3D Rank Badge */}
              <Animated.View style={[
                styles.rankBadge,
                { 
                  transform: [{ scale: pulseAnim }],
                  shadowColor: rank.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                }
              ]}>
                <LinearGradient
                  colors={[rank.color, rank.gradient[1]]}
                  style={styles.rankBadgeGradient}
                >
                  <Text style={styles.rankEmoji}>{rank.emoji}</Text>
                </LinearGradient>
              </Animated.View>
            </View>

            {/* Glowing User Info */}
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { textShadowColor: rank.color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }]}>
                {user?.displayName || 'Anonymous User'}
              </Text>
              <View style={styles.rankContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                  style={styles.rankPill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.rankText}>{rank.emoji} {rank.text} Rank</Text>
                </LinearGradient>
              </View>
              <Text style={styles.userSince}>
                Joined {format(user?.createdAt || new Date(), 'MMM yyyy')}
              </Text>
            </View>
          </Animated.View>

          {/* Glassmorphic Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>🎯</Text>
                </View>
                <Text style={styles.statValue}>{user?.challengesCompleted || 0}</Text>
                <Text style={styles.statLabel}>Completions</Text>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>Top 15% 📈</Text>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.05)']}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>🪙</Text>
                </View>
                <Text style={styles.statValue}>{user?.dcoinsLifeTimeEarned || 0}</Text>
                <Text style={styles.statLabel}>DC Earned</Text>
                <View style={styles.statBadge}>
                  <Text style={styles.statStreakText}>
                    {getStreakEmoji(user?.challengesCompleted || 0)}
                  </Text>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.glassCard}>
              <LinearGradient
                colors={['rgba(138,43,226,0.15)', 'rgba(138,43,226,0.05)']}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>⭐</Text>
                </View>
                <Text style={styles.statValue}>{user?.reputation || 0}</Text>
                <Text style={styles.statLabel}>Reputation</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Holographic Balance Card */}
          <View style={styles.balanceCardContainer}>
            <LinearGradient
              colors={['rgba(102,126,234,0.3)', 'rgba(118,75,162,0.3)']}
              style={styles.balanceCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.balanceCardInner}>
                <Text style={styles.balanceLabel}>💳 Current Balance</Text>
                <View style={styles.balanceRow}>
                  <View style={styles.coinContainer}>
                    <LinearGradient
                      colors={['#FFD700', '#FFA500']}
                      style={styles.coinGradient}
                    >
                      <Text style={styles.balanceEmoji}>🪙</Text>
                    </LinearGradient>
                  </View>
                  <Text style={styles.balanceValue}>{user?.dcoins || 0}</Text>
                  <Text style={styles.balanceCurrency}>DC</Text>
                </View>
                <Pressable
                  style={styles.addFundsButton}
                  onPress={() => router.push('/purchase-tokens')}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.addFundsGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.addFundsText}>✨ Add DCoins</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          {/* Neon Share Stats Button */}
          <TouchableOpacity 
            style={styles.shareStatsButtonContainer}
            onPress={() => {
              const message = `🎮 I've completed ${user?.challengesCompleted || 0} challenges on DareCoins!\n\n💰 ${user?.dcoinsLifeTimeEarned || 0} DC earned\n${rank.emoji} ${rank.text} Rank\n\nThink you can beat me? 😏\n[App Link]`;
              Share.share({ message });
            }}
          >
            <LinearGradient
              colors={['#FF006E', '#8338EC', '#3A86FF']}
              style={styles.shareStatsButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.shareStatsText}>📤 Share My Stats</Text>
              <Text style={styles.shareStatsSubtext}>+5 DC Bonus</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Recent Completions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎬 Recent Completions</Text>
            <Text style={styles.sectionSubtitle}>Tap to share your wins!</Text>
          </View>

          {userCompletions.length > 0 ? (
            <FlatList
              data={userCompletions}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
                  style={[styles.completionCard, { 
                    transform: [{ scale: 1 }],
                  }]}
                  onPress={() => handleShareCompletion(item)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={[
                      index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#f093fb' : '#4facfe',
                      index % 3 === 0 ? '#764ba2' : index % 3 === 1 ? '#f5576c' : '#00f2fe'
                    ]}
                    style={styles.completionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {/* Shine effect overlay */}
                    <View style={styles.shineOverlay} />
                    
                    <View style={styles.completionContent}>
                      <View style={styles.completionIconContainer}>
                        <View style={styles.iconGlow}>
                          <Text style={styles.completionIcon}>🎥</Text>
                        </View>
                      </View>
                      
                      <View style={styles.completionTextContainer}>
                        <Text style={styles.completionTitle} numberOfLines={2}>
                          {item.caption || 'Untitled Completion'}
                        </Text>
                        <Text style={styles.completionDate}>
                          {format(item.submittedAt, 'MMM d, yyyy')}
                        </Text>
                      </View>

                      <View style={styles.completionFooter}>
                        <View style={styles.rewardContainer}>
                          <LinearGradient
                            colors={['rgba(255,215,0,0.3)', 'rgba(255,165,0,0.3)']}
                            style={styles.rewardBadge}
                          >
                            <Text style={styles.rewardEmoji}>🪙</Text>
                            <Text style={styles.rewardText}>{item.rewardAmount || 0} DC</Text>
                          </LinearGradient>
                        </View>
                        
                        <View style={styles.shareHintContainer}>
                          <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                            style={styles.shareHint}
                          >
                            <Text style={styles.shareHintText}>📤 Share</Text>
                          </LinearGradient>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.emptyCard}
              >
                <Text style={styles.emptyIcon}>🎯</Text>
                <Text style={styles.emptyText}>No completions yet</Text>
                <Text style={styles.emptySubtext}>
                  Start completing challenges to see them here!
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Padding for bottom tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Premium Share Modal */}
        {showShareModal && selectedCompletion && (
          <View style={styles.modalOverlay}>
            <View style={styles.shareModalContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.shareCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.shareCardHeader}>
                  <Text style={styles.shareCardTitle}>🎉 Challenge Completed!</Text>
                </View>
                
                <View style={styles.shareCardContent}>
                  <View style={styles.shareCardChallengeContainer}>
                    <Text style={styles.shareCardChallenge}>
                      {selectedCompletion.caption || 'Challenge'}
                    </Text>
                  </View>
                  
                  <View style={styles.shareCardStats}>
                    <View style={styles.shareCardStat}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                        style={styles.shareCardStatInner}
                      >
                        <Text style={styles.shareCardStatValue}>
                          +{selectedCompletion.rewardAmount || 0}
                        </Text>
                        <Text style={styles.shareCardStatLabel}>🪙 DC Earned</Text>
                      </LinearGradient>
                    </View>
                    
                    <View style={styles.shareCardStat}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                        style={styles.shareCardStatInner}
                      >
                        <Text style={styles.shareCardStatValue}>
                          {user?.challengesCompleted || 0}
                        </Text>
                        <Text style={styles.shareCardStatLabel}>🏆 Total</Text>
                      </LinearGradient>
                    </View>
                  </View>

                  <Text style={styles.shareCardUser}>
                    by @{user?.displayName || 'user'}
                  </Text>
                </View>

                <View style={styles.shareCardFooter}>
                  <Text style={styles.shareCardCTA}>Think you can do better? 😏</Text>
                  <Text style={styles.shareCardApp}>Join me on DareCoins</Text>
                </View>
              </LinearGradient>

              {/* Action Buttons */}
              <TouchableOpacity 
                style={styles.shareActionButtonContainer}
                onPress={shareToSocial}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.shareActionButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.shareActionText}>📤 Share to Social Media</Text>
                  <Text style={styles.shareActionBonus}>+5 DC bonus!</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.shareActionButtonContainer}
                onPress={challengeFriend}
              >
                <LinearGradient
                  colors={['#FF006E', '#8338EC']}
                  style={styles.shareActionButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.shareActionText}>⚔️ Challenge a Friend</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowShareModal(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Premium Logout Modal */}
        {showLogoutModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.logoutModalContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.logoutModal}
              >
                <Text style={styles.modalTitle}>👋 Log Out</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to log out?
                </Text>

                <TouchableOpacity
                  onPress={confirmLogout}
                  style={styles.logoutButtonContainer}
                >
                  <LinearGradient
                    colors={['#FF006E', '#8338EC']}
                    style={styles.logoutButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowLogoutModal(false)}
                  style={styles.cancelModalButton}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg,
    zIndex: 10,
  },
  settingsButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  settingsGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  settingsIcon: {
    fontSize: 22,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingTop: 60,
    position: 'relative',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
    position: 'relative',
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  avatarInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    padding: 3,
    backgroundColor: '#0F0C29',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 53,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
  },
  rankBadgeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0F0C29',
  },
  rankEmoji: {
    fontSize: 24,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  rankContainer: {
    marginTop: Spacing.sm,
    overflow: 'hidden',
    borderRadius: 20,
  },
  rankPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  userSince: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: Spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  glassCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: Spacing.xs,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  statBadge: {
    marginTop: Spacing.xs,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(76,175,80,0.2)',
    borderRadius: 10,
  },
  statBadgeText: {
    fontSize: 9,
    color: '#4CAF50',
    fontWeight: '700',
  },
  statStreakText: {
    fontSize: 16,
  },
  balanceCardContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  balanceCard: {
    borderRadius: BorderRadius.xl,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  balanceCardInner: {
    backgroundColor: 'rgba(15,12,41,0.6)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  coinContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  coinGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceEmoji: {
    fontSize: 28,
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    marginRight: 4,
  },
  balanceCurrency: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  addFundsButton: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  addFundsGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  addFundsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  shareStatsButtonContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shareStatsButton: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  shareStatsText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 2,
  },
  shareStatsSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  sectionHeader: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  completionCard: {
    width: width * 0.6,
    height: 220,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.md,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completionGradient: {
    flex: 1,
    position: 'relative',
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  completionContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  completionIconContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  iconGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionIcon: {
    fontSize: 40,
  },
  completionTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  completionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  completionDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  completionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flex: 1,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  rewardEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  shareHintContainer: {
    overflow: 'hidden',
    borderRadius: 15,
  },
  shareHint: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  shareHintText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  emptyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    zIndex: 999,
  },
  shareModalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  shareCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  shareCardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shareCardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  shareCardContent: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  shareCardChallengeContainer: {
    marginBottom: Spacing.xl,
  },
  shareCardChallenge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  shareCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  shareCardStat: {
    flex: 1,
  },
  shareCardStatInner: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  shareCardStatValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  shareCardStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  shareCardUser: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },
  shareCardFooter: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
  },
  shareCardCTA: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  shareCardApp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  shareActionButtonContainer: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  shareActionButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  shareActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  shareActionBonus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  logoutModalContainer: {
    width: '90%',
    maxWidth: 350,
  },
  logoutModal: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: Spacing.md,
    color: '#fff',
  },
  modalText: {
    marginBottom: Spacing.xl,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  logoutButtonContainer: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  logoutButton: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  cancelModalButton: {
    padding: Spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelModalButtonText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
  },
});