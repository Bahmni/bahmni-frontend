import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'
import {TextEncoder, TextDecoder} from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
