import React, { useState } from 'react'
import style from "../../style/Form/Registration.module.scss"

interface FormData {
  name: string;
  email: string;
  password: string;
}

function Registration() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setErrors({})

    try {
      console.log('Отправка данных:', formData)

      const response = await fetch('http://127.0.0.1:8000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      console.log('Статус ответа:', response.status)

      const responseText = await response.text()
      console.log('Ответ сервера:', responseText)

      let data: any;
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Ошибка парсинга JSON:', parseError)
        throw new Error(`Сервер вернул невалидный JSON: ${responseText.substring(0, 100)}...`)
      }

      if (!response.ok) {
        if (data.errors) {
          const errorMessages: {[key: string]: string} = {}
          Object.keys(data.errors).forEach(key => {
            errorMessages[key] = data.errors[key][0]
          })
          setErrors(errorMessages)
          throw new Error('Проверьте правильность введенных данных')
        }
        throw new Error(data.message || `Ошибка сервера: ${response.status}`)
      }

      setMessage('Регистрация успешна!')
      
      setFormData({
        name: '',
        email: '',
        password: ''
      })

    } catch (error: any) {
      console.error('Полная ошибка:', error)
      setMessage(error.message || 'Произошла ошибка при регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style.main}>
      <div className={style.containter}>
        <h1>Регистрация</h1>
        
        {message && (
          <div className={message.includes('успешна') ? style.successMessage : style.errorMessage}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Имя</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите ваше имя"
              disabled={loading}
              required
              className={errors.name ? style.inputError : ''}
            />
            {errors.name && <span className={style.errorText}>{errors.name}</span>}
          </div>

          <div>
            <label htmlFor="email">Почта</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
              required
              className={errors.email ? style.inputError : ''}
            />
            {errors.email && <span className={style.errorText}>{errors.email}</span>}
          </div>

          <div>
            <label htmlFor="password">Пароль</label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Создайте пароль (минимум 6 символов)"
              disabled={loading}
              required
              className={errors.password ? style.inputError : ''}
            />
            {errors.password && <span className={style.errorText}>{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Registration