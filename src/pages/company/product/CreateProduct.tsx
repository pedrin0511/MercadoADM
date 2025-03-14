import React, { useState } from 'react'
import Return from '../../../components/buttons/Return'
import { useParams } from 'react-router-dom';

interface product{
    price: number | null
    description:string
    category:string
    id_company: string
}

const CreateProduct = () => {
const { id } = useParams<{ id: string }>()
const [product,setProduct] = useState<product>({
  price:null,
  description:"",
  category:"",
  id_company: id || ""
})


const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
  const {name,value} = e.target
  setProduct(prev =>({
    ...prev,
    [name]: name === 'price' ? Number(value) || null : value
  }))
}

const handleSubmit = async(e: React.FormEvent)=>{
    e.preventDefault()
    console.log("Enviando produto:", product)

    try {
      
    } catch (error) {
      
    }
}

  return (
    <div>
      <Return/>
      <h1>Cadastrar produto</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" name="price" placeholder="Preço" value={product.price || ""} onChange={handleChange} required />
        <textarea name="description" placeholder="Descrição" value={product.description} onChange={handleChange} required />
        <select 
          name="category" 
          value={product.category} 
          onChange={handleChange} 
          required
        >
          <option value="">Selecione a categoria</option>
          <option value="farelo_de_soja">Farelo de Soja</option>
          <option value="milho">Milho</option>
          <option value="trigo">Trigo</option>
        </select>
        
        <button type="submit">Cadastrar</button>

      </form>
    </div>
  )
}

export default CreateProduct
