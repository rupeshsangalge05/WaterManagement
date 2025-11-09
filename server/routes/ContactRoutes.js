import express from 'express'
import { createContact } from '../controllers/ContactController.js'
import { getContacts } from '../controllers/ContactController.js';

const ContactRouter = express.Router();

ContactRouter.post('/', createContact);
ContactRouter.get('/', getContacts);


export default ContactRouter;
