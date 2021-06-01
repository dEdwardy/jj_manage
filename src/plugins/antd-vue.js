import {
  Layout,
  Button,
  Form,
  Table,
  Popconfirm,
  Menu,
  Modal,
  Row,
  Col,
  Input,
  Switch,
  Select
} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

export default function (app) {
  app
    .use(Layout)
    .use(Button)
    .use(Form)
    .use(Table)
    .use(Popconfirm)
    .use(Menu)
    .use(Modal)
    .use(Row)
    .use(Col)
    .use(Input)
    .use(Switch)
    .use(Select)
}
