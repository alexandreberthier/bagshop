import { defineStore } from "pinia";
import {computed, ref} from "vue";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { User } from "@/models/User";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type {UserDTO} from "@/models/User";
import {auth, db} from "@/config/firebaseConfig";

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const error = ref<string | null>(null);
    const isLoaded = ref(false);
    const isLoggedIn = computed(() => !!user.value);
    const isAdmin = computed(() => user.value?.role === "admin");

    async function register(email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUserDTO: UserDTO = {
                id: userCredential.user.uid,
                role: "user",
                isAnonymous: false,
                personalData: {
                    firstName: "",
                    lastName: "",
                    email: email,
                    phoneNumber: "",
                },
                deliveryData: undefined,
            };

            user.value = User.fromDto(newUserDTO);

            await setDoc(doc(db, "users", newUserDTO.id!), {
                id: newUserDTO.id,
                role: newUserDTO.role,
                isAnonymous: newUserDTO.isAnonymous,
                personalData: newUserDTO.personalData,
                deliveryData: newUserDTO.deliveryData || null,
            });

            error.value = null;
        } catch (e: any) {
            error.value = e.message || "Ein Fehler ist aufgetreten.";
            user.value = null;
        }
    }

    async function login(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;


            const userDoc = await getDoc(doc(db, "users", userId));

            if (!userDoc.exists()) {
                throw new Error("Benutzer nicht gefunden");
            }

            const userData = userDoc.data() as UserDTO;
            user.value = User.fromDto(userData);

            error.value = null;
        } catch (e: any) {
            error.value = e.message || "Ein Fehler ist aufgetreten.";
            user.value = null;
        }
    }

    async function logout() {
        try {
            await signOut(auth);
            user.value = null;
            error.value = null;
        } catch (e: any) {
            error.value = e.message || "Ein Fehler ist aufgetreten.";
        }
    }

    async function fetchUser() {
        isLoaded.value = false;
        return new Promise<void>((resolve) => {
            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data() as UserDTO;
                        user.value = User.fromDto(userData);
                    }
                } else {
                    user.value = null;
                }
                isLoaded.value = true;
                resolve();
            });
        });
    }

    async function updateUserData(updatedData: Partial<UserDTO>) {
        if (!user.value) {
            throw new Error("Kein Benutzer eingeloggt");
        }

        const userId = user.value.id;
        if (!userId) {
            throw new Error("Benutzer-ID fehlt");
        }

        // Aktualisiere Firestore
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            ...user.value.toDto(),
            ...updatedData,
        }, { merge: true }); // Nur die geänderten Daten aktualisieren

        // Aktualisiere den lokalen Store
        if (updatedData.personalData) {
            user.value.personalData = { ...user.value.personalData, ...updatedData.personalData };
        }
        if (updatedData.deliveryData) {
            user.value.deliveryData = { ...user.value.deliveryData, ...updatedData.deliveryData };
        }
    }


    return {
        user,
        error,
        register,
        login,
        logout,
        isLoggedIn,
        isAdmin,
        fetchUser,
        isLoaded,
        updateUserData
    }
})
