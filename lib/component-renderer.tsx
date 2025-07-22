import HeroFull from '@/components/heroes/HeroFull'
import HeroBasic from '@/components/heroes/HeroBasic'
import HeroSearch from '@/components/heroes/HeroSearch'
import TrustedPartners from '@/components/sections/TrustedPartners'
import ThreeUpGrid from '@/components/sections/ThreeUpGrid'
import PricingSection from '@/components/sections/PricingSection'
import SparklineEmbed from '@/components/sections/SparklineEmbed'

interface ComponentData {
  _type: string
  _key: string
  [key: string]: any
}

const componentMap = {
  heroFull: HeroFull,
  heroBasic: HeroBasic,
  heroSearch: HeroSearch,
  trustedPartners: TrustedPartners,
  threeUpGrid: ThreeUpGrid,
  pricingSection: PricingSection,
  sparklineEmbed: SparklineEmbed,
} as const

export function renderComponent(component: ComponentData, basePath?: string, index?: number) {
  const { _type, _key, ...props } = component
  
  const Component = componentMap[_type as keyof typeof componentMap]
  
  if (!Component) {
    console.warn(`Unknown component type: ${_type}`)
    return null
  }
  
  // Create path for visual editing
  const componentPath = basePath && typeof index === 'number' 
    ? `${basePath}.content[${index}]` 
    : undefined
  
  return (
    <Component 
      key={_key} 
      {...props} 
      _path={componentPath}
    />
  )
}

export function renderComponents(components: ComponentData[], basePath?: string) {
  if (!Array.isArray(components)) {
    return null
  }
  
  return components.map((component, index) => 
    renderComponent(component, basePath, index)
  )
}