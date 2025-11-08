import Contact from '../models/Contact.js'

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newContact = new Contact({ name, email, phone, subject, message });

    await newContact.save();

    // console.log('📩 Contact form submitted:', req.body);

    res.status(200).json({ message: 'Message received! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
};



export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
    // const contacts = await Contact.find().sort({ crearedAt: -1 })
    // console.log(contacts)
    if (!contacts) res.status(400).json({ message: "Contact not found" })

    res.status(200).json({contacts})
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
}
