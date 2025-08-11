// frontend/src/components/__tests__/ApplicationLogo.test.tsx
import { render, screen } from '@testing-library/react'
import ApplicationLogo from '../ApplicationLogo'

describe('ApplicationLogo', () => {
  it('deve renderizar a imagem do logo', () => {
    render(<ApplicationLogo />)

    // Procura pela imagem com o texto alternativo "Logo"
    const logoImage = screen.getByAltText('Logo')

    // Verifica se a imagem está no documento
    expect(logoImage).toBeInTheDocument()
    
    // Verifica se a imagem possui o atributo 'src' correto (a verificação do next/image é mais complexa, então focamos na presença e no alt text)
    expect(logoImage).toHaveAttribute('src')
  })
})