import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://192.168.105.101:5000/api/products?page=${page}`);
            const data = await response.json();
            setProducts((prev) => [...prev, ...data]);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productContainer}
            onPress={() => navigation.navigate("ProductDetail", { id: item._id })}
        >
            <Image source={{ uri: item.images[0] }} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{"<"}</Text>
                </TouchableOpacity>
                <TextInput placeholder="Search" style={styles.searchInput} />
                <TouchableOpacity>
                    <Text style={styles.userIcon}>👤</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={renderProduct}
                onEndReached={() => setPage(page + 1)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 },
    backButton: { fontSize: 20 },
    searchInput: { flex: 1, marginHorizontal: 10, borderWidth: 1, padding: 5, borderRadius: 5 },
    userIcon: { fontSize: 20 },
    productContainer: { padding: 10, borderBottomWidth: 1 },
    productImage: { width: 100, height: 100, borderRadius: 5 },
    productTitle: { fontSize: 16, fontWeight: "bold" },
    productPrice: { fontSize: 14, color: "green" },
});

export default HomeScreen;
