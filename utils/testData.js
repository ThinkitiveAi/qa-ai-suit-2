import { fakerEN, fakerEN_GB } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const patientNameListFile = path.join(__dirname, 'patientNameList.json');

export const testUser = {
  email: 'amol.shete+TP@medarch.com',
  password: 'Test@123$'
};

export function generateRandomPatientData() {
  const faker = Math.random() > 0.5 ? fakerEN : fakerEN_GB;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const phone = faker.phone.number();
  const gender = faker.person.sexType();
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 80;
  const maxYear = currentYear - 18;
  const year = faker.number.int({ min: minYear, max: maxYear });
  const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0');
  const day = String(faker.number.int({ min: 1, max: 28 })).padStart(2, '0');
  const dob = `${month}-${day}-${year}`;
  return {
    firstName,
    lastName,
    email,
    phone,
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    dob
  };
}

export function appendPatientName(name) {
  let list = [];
  if (fs.existsSync(patientNameListFile)) {
    list = JSON.parse(fs.readFileSync(patientNameListFile, 'utf-8'));
  }
  list.push(name);
  fs.writeFileSync(patientNameListFile, JSON.stringify(list), 'utf-8');
}

export function getLatestPatientName() {
  if (fs.existsSync(patientNameListFile)) {
    const list = JSON.parse(fs.readFileSync(patientNameListFile, 'utf-8'));
    return list.length > 0 ? list[list.length - 1] : null;
  }
  return null;
}

export function popLatestPatientName() {
  if (fs.existsSync(patientNameListFile)) {
    let list = JSON.parse(fs.readFileSync(patientNameListFile, 'utf-8'));
    if (list.length > 0) {
      const name = list.pop();
      fs.writeFileSync(patientNameListFile, JSON.stringify(list), 'utf-8');
      return name || null;
    }
  }
  return null;
} 