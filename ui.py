"""Simple Streamlit demo showing a random mascot image."""
import streamlit as st
from mascot_manager import get_random_mascot, list_mascots

st.title("AI Assistant With Mascot")

mascots = list_mascots()
if not mascots:
    st.error("No mascots found in the `mascots/` directory.")
else:
    if st.button("Random Mascot"):
        m = get_random_mascot()
    else:
        m = mascots[0]

    st.image(m, width=250)
    st.write("Your AI avatar for this session 👆")
