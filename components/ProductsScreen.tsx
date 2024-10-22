import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App';
import { Product } from '../types';

type ProductsScreenProps = StackScreenProps<RootStackParamList, 'Products'>;

const PRODUCTS_STORAGE_KEY = 'stored_products';

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch products from the API
  const fetchProductsFromAPI = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      
      if (response.status === 200) {
        const productData = response.data;
        setProducts(productData);

        // Save the fetched products to AsyncStorage
        await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productData));
      } else {
        // Handle unexpected status codes
        console.error(`Server returned status ${response.status}`);
        Alert.alert("Error", "Failed to fetch products from server. Try again later.");
      }
    } catch (error) {
      console.error('Error fetching products from API:', error);
      
      // Show an alert to the user and load products from AsyncStorage
      Alert.alert("Error", "There was a problem loading the products. Showing offline data if available.");
      await loadStoredProducts(); // Try loading from storage in case of failure
    } finally {
      setLoading(false);
    }
  };

  // Function to load products from AsyncStorage
  const loadStoredProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading products from AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsFromAPI(); // Try fetching products from API on mount
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.productInner}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Products List</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  productInner: {
    alignItems: 'center',
    padding: 10,
  },
  productImage: {
    width: Dimensions.get('window').width / 2.5,
    height: 150,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
});
















//simple:

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import axios from 'axios';
// import { StackScreenProps } from '@react-navigation/stack';
// import { RootStackParamList } from '../App';
// import { Product } from '../types';

// type ProductsScreenProps = StackScreenProps<RootStackParamList, 'Products'>;

// const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     axios
//       .get('https://fakestoreapi.com/products')
//       .then((response: any) => setProducts(response.data))
//       .catch((error: any) => console.error(error));
//   }, []);

//   const renderItem = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.productContainer}
//       onPress={() => navigation.navigate('ProductDetails', { product: item })}
//     >
//       <View style={styles.productInner}>
//         <Image source={{ uri: item.image }} style={styles.productImage} />
//         <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
//         <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Products List</Text>
//       </View>

//       <View style={styles.container}>
//         <FlatList
//           data={products}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderItem}
//           numColumns={2}
//           columnWrapperStyle={styles.row}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// export default ProductsScreen;

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flex: 1,
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#f8f8f8',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   row: {
//     justifyContent: 'space-between',
//   },
//   productContainer: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   productInner: {
//     alignItems: 'center',
//     padding: 10,
//   },
//   productImage: {
//     width: Dimensions.get('window').width / 2.5,
//     height: 150,
//     resizeMode: 'contain',
//   },
//   productTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   productPrice: {
//     fontSize: 16,
//     color: '#888',
//     marginTop: 5,
//   },
// });






// // import React, { useState, useEffect } from 'react';
// // import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// // import { StackScreenProps } from '@react-navigation/stack';
// // import { RootStackParamList } from '../App';
// // import { Product } from '../types';

// // type ProductsScreenProps = StackScreenProps<RootStackParamList, 'Products'>;

// // const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         // First, check if we have data in AsyncStorage
// //         const cachedData = await AsyncStorage.getItem('@products_data');
// //         if (cachedData) {
// //           setProducts(JSON.parse(cachedData)); // Set the cached data
// //           setLoading(false); // Loading is done when we find cached data
// //         }

// //         // Fetch data from the API
// //         const response = await axios.get('https://fakestoreapi.com/products');
// //         setProducts(response.data);

// //         // Save the fetched data to AsyncStorage
// //         await AsyncStorage.setItem('@products_data', JSON.stringify(response.data));

// //         setLoading(false); // Once data is fetched, loading is set to false
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const renderItem = ({ item }: { item: Product }) => (
// //     <TouchableOpacity
// //       style={styles.productContainer}
// //       onPress={() => navigation.navigate('ProductDetails', { product: item })}
// //     >
// //       <View style={styles.productInner}>
// //         <Image source={{ uri: item.image }} style={styles.productImage} />
// //         <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
// //         <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <ScrollView style={styles.scrollContainer}>
// //       <View style={styles.header}>
// //         <Text style={styles.headerText}>Products List</Text>
// //       </View>

// //       <View style={styles.container}>
// //         {loading ? (
// //           <Text>Loading...</Text> // Show loading text while data is fetched
// //         ) : (
// //           <FlatList
// //             data={products}
// //             keyExtractor={(item) => item.id.toString()}
// //             renderItem={renderItem}
// //             numColumns={2}
// //             columnWrapperStyle={styles.row}
// //           />
// //         )}
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // export default ProductsScreen;

// // const styles = StyleSheet.create({
// //   scrollContainer: {
// //     flex: 1,
// //   },
// //   header: {
// //     padding: 20,
// //     backgroundColor: '#f8f8f8',
// //     alignItems: 'center',
// //     borderBottomWidth: 1,
// //     borderColor: '#ddd',
// //   },
// //   headerText: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //   },
// //   container: {
// //     flex: 1,
// //     padding: 10,
// //   },
// //   row: {
// //     justifyContent: 'space-between',
// //   },
// //   productContainer: {
// //     flex: 1,
// //     margin: 10,
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     overflow: 'hidden',
// //     elevation: 3,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 4,
// //   },
// //   productInner: {
// //     alignItems: 'center',
// //     padding: 10,
// //   },
// //   productImage: {
// //     width: Dimensions.get('window').width / 2.5,
// //     height: 150,
// //     resizeMode: 'contain',
// //   },
// //   productTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginTop: 10,
// //     textAlign: 'center',
// //   },
// //   productPrice: {
// //     fontSize: 16,
// //     color: '#888',
// //     marginTop: 5,
// //   },
// // });









// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
// import { StackScreenProps } from '@react-navigation/stack';
// import { RootStackParamList } from '../App';
// import { Product } from '../types';

// type ProductsScreenProps = StackScreenProps<RootStackParamList, 'Products'>;

// const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Function to fetch from API
//   const fetchFromAPI = async () => {
//     try {
//       const response = await axios.get('https://fakestoreapi.com/products');
//       const data = response.data;
//       setProducts(data); // Set products to state
//       await AsyncStorage.setItem('@products_data', JSON.stringify(data)); // Store in AsyncStorage
//     } catch (error) {
//       console.error('Error fetching from API:', error);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Function to load data from AsyncStorage
//   const loadFromCache = async () => {
//     try {
//       const cachedData = await AsyncStorage.getItem('@products_data');
//       if (cachedData) {
//         setProducts(JSON.parse(cachedData)); // Parse and set data from cache
//       }
//     } catch (error) {
//       console.error('Error loading from cache:', error);
//     } finally {
//       setLoading(false); // Stop loading even if cache is empty
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true); // Set loading true while fetching
//       await loadFromCache(); // Try loading from cache first
//       fetchFromAPI(); // Fetch from API in any case to update data
//     };
//     fetchData();
//   }, []);

//   const renderItem = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.productContainer}
//       onPress={() => navigation.navigate('ProductDetails', { product: item })}
//     >
//       <View style={styles.productInner}>
//         <Image source={{ uri: item.image }} style={styles.productImage} />
//         <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
//         <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Products List</Text>
//       </View>

//       <View style={styles.container}>
//         {loading ? (
//           <Text>Loading...</Text> // Show loading text while data is fetched
//         ) : (
//           <FlatList
//             data={products}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             numColumns={2}
//             columnWrapperStyle={styles.row}
//           />
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default ProductsScreen;

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flex: 1,
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#f8f8f8',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   row: {
//     justifyContent: 'space-between',
//   },
//   productContainer: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   productInner: {
//     alignItems: 'center',
//     padding: 10,
//   },
//   productImage: {
//     width: Dimensions.get('window').width / 2.5,
//     height: 150,
//     resizeMode: 'contain',
//   },
//   productTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   productPrice: {
//     fontSize: 16,
//     color: '#888',
//     marginTop: 5,
//   },
// });
