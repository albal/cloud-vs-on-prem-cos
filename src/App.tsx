import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Server, Cloud, Calculator, TrendingUp } from '@phosphor-icons/react'

interface HardwareSpecs {
  cpu: number
  memory: number
  storage: number
}

interface CostBreakdown {
  hardware: number
  power: number
  total: number
  details: string
}

interface CloudCost {
  instanceType: string
  monthlyRate: number
  total: number
}

const HardwareCostComparison: React.FC = () => {
  const [specs, setSpecs] = useState<HardwareSpecs>({
    cpu: 4,
    memory: 16,
    storage: 500
  })

  const [azureCost, setAzureCost] = useState<CloudCost | null>(null)
  const [awsCost, setAwsCost] = useState<CloudCost | null>(null)
  const [onPremCost, setOnPremCost] = useState<CostBreakdown | null>(null)

  const calculateAzureCost = (specs: HardwareSpecs): CloudCost => {
    // Azure VM pricing approximation based on common instances
    let instanceType = ''
    let monthlyRate = 0

    if (specs.cpu <= 2 && specs.memory <= 8) {
      instanceType = 'Standard_B2s'
      monthlyRate = 35
    } else if (specs.cpu <= 4 && specs.memory <= 16) {
      instanceType = 'Standard_D4s_v3'
      monthlyRate = 140
    } else if (specs.cpu <= 8 && specs.memory <= 32) {
      instanceType = 'Standard_D8s_v3'
      monthlyRate = 280
    } else if (specs.cpu <= 16 && specs.memory <= 64) {
      instanceType = 'Standard_D16s_v3'
      monthlyRate = 560
    } else {
      instanceType = 'Standard_D32s_v3'
      monthlyRate = 1120
    }

    // Add storage costs (Premium SSD)
    const storageCostPerGB = 0.15
    monthlyRate += specs.storage * storageCostPerGB

    return {
      instanceType,
      monthlyRate,
      total: monthlyRate * 36 // 3 years
    }
  }

  const calculateAWSCost = (specs: HardwareSpecs): CloudCost => {
    // AWS EC2 pricing approximation
    let instanceType = ''
    let monthlyRate = 0

    if (specs.cpu <= 2 && specs.memory <= 8) {
      instanceType = 't3.large'
      monthlyRate = 67
    } else if (specs.cpu <= 4 && specs.memory <= 16) {
      instanceType = 'm5.xlarge'
      monthlyRate = 175
    } else if (specs.cpu <= 8 && specs.memory <= 32) {
      instanceType = 'm5.2xlarge'
      monthlyRate = 350
    } else if (specs.cpu <= 16 && specs.memory <= 64) {
      instanceType = 'm5.4xlarge'
      monthlyRate = 700
    } else {
      instanceType = 'm5.8xlarge'
      monthlyRate = 1400
    }

    // Add EBS storage costs (gp3)
    const storageCostPerGB = 0.08
    monthlyRate += specs.storage * storageCostPerGB

    return {
      instanceType,
      monthlyRate,
      total: monthlyRate * 36 // 3 years
    }
  }

  const calculateOnPremCost = (specs: HardwareSpecs): CostBreakdown => {
    // Base hardware costs (approximating bargain hardware prices)
    let hardwareCost = 0
    let powerConsumption = 0 // in watts
    let details = ''

    if (specs.cpu <= 8 && specs.memory <= 64) {
      // Dell R730 equivalent
      hardwareCost = 800
      powerConsumption = 200
      details = 'Dell R730 (2x E5-2620 v4, 64GB RAM)'
    } else if (specs.cpu <= 16 && specs.memory <= 128) {
      // Dell R740 equivalent
      hardwareCost = 1200
      powerConsumption = 250
      details = 'Dell R740 (2x Silver 4114, 128GB RAM)'
    } else {
      // High-end server
      hardwareCost = 2000
      powerConsumption = 300
      details = 'Dell R740 (2x Gold 6134, 256GB RAM)'
    }

    // SSD costs (need to buy full drives, not just storage used)
    const ssdCount = Math.ceil(specs.storage / 960) // 960GB enterprise SSDs
    const ssdCostPerDrive = 120
    hardwareCost += ssdCount * ssdCostPerDrive

    // Power costs over 3 years
    const hoursPerYear = 8760
    const powerCostPerKWh = 0.25 // £0.25 per kWh
    const coolingMultiplier = 1.4 // 40% additional for cooling
    
    const annualPowerCost = (powerConsumption / 1000) * hoursPerYear * powerCostPerKWh * coolingMultiplier
    const totalPowerCost = annualPowerCost * 3

    return {
      hardware: hardwareCost,
      power: totalPowerCost,
      total: hardwareCost + totalPowerCost,
      details: `${details}, ${ssdCount}x 960GB SSD`
    }
  }

  useEffect(() => {
    setAzureCost(calculateAzureCost(specs))
    setAwsCost(calculateAWSCost(specs))
    setOnPremCost(calculateOnPremCost(specs))
  }, [specs])

  const updateSpec = (key: keyof HardwareSpecs, value: string) => {
    const numValue = Math.max(1, parseInt(value) || 1)
    setSpecs(prev => ({ ...prev, [key]: numValue }))
  }

  const getLowestCost = () => {
    if (!azureCost || !awsCost || !onPremCost) return null
    
    const costs = [
      { platform: 'Azure', cost: azureCost.total },
      { platform: 'AWS', cost: awsCost.total },
      { platform: 'On-Prem', cost: onPremCost.total }
    ]
    
    return costs.reduce((min, current) => 
      current.cost < min.cost ? current : min
    )
  }

  const lowestCost = getLowestCost()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Hardware Cost Comparison Tool
          </h1>
          <p className="text-muted-foreground">
            Compare 3-year total cost of ownership across Azure, AWS, and On-Premises infrastructure
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Input Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Hardware Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cpu">CPU Cores</Label>
                <Input
                  id="cpu"
                  type="number"
                  min="1"
                  max="128"
                  value={specs.cpu}
                  onChange={(e) => updateSpec('cpu', e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div>
                <Label htmlFor="memory">Memory (GB)</Label>
                <Input
                  id="memory"
                  type="number"
                  min="1"
                  max="1024"
                  value={specs.memory}
                  onChange={(e) => updateSpec('memory', e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div>
                <Label htmlFor="storage">Storage (GB)</Label>
                <Input
                  id="storage"
                  type="number"
                  min="1"
                  max="10000"
                  value={specs.storage}
                  onChange={(e) => updateSpec('storage', e.target.value)}
                  className="font-mono"
                />
              </div>

              {lowestCost && (
                <div className="mt-6 rounded-lg bg-accent/10 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Best Value
                  </div>
                  <p className="text-lg font-bold text-accent-foreground">
                    {lowestCost.platform}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    £{lowestCost.cost.toLocaleString()} over 3 years
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Comparison Cards */}
          <div className="lg:col-span-3">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Azure Card */}
              <Card className="border-azure/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-azure" />
                      Azure
                    </div>
                    <Badge style={{ backgroundColor: 'var(--azure)', color: 'white' }}>
                      {azureCost?.instanceType}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {azureCost && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold font-mono">
                          £{azureCost.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">3-year total</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly rate:</span>
                          <span className="font-mono">£{azureCost.monthlyRate.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Instance type:</span>
                          <span className="font-mono">{azureCost.instanceType}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AWS Card */}
              <Card className="border-aws/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-aws" />
                      AWS
                    </div>
                    <Badge style={{ backgroundColor: 'var(--aws)', color: 'white' }}>
                      {awsCost?.instanceType}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {awsCost && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold font-mono">
                          £{awsCost.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">3-year total</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly rate:</span>
                          <span className="font-mono">£{awsCost.monthlyRate.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Instance type:</span>
                          <span className="font-mono">{awsCost.instanceType}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* On-Prem Card */}
              <Card className="border-onprem/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-onprem" />
                      On-Premises
                    </div>
                    <Badge style={{ backgroundColor: 'var(--onprem)', color: 'white' }}>
                      Enterprise
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {onPremCost && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold font-mono">
                          £{onPremCost.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">3-year total</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Hardware:</span>
                          <span className="font-mono">£{onPremCost.hardware.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Power & cooling:</span>
                          <span className="font-mono">£{onPremCost.power.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {onPremCost.details}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Cost Breakdown Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Platform</th>
                        <th className="text-right p-2">Monthly Cost</th>
                        <th className="text-right p-2">3-Year Total</th>
                        <th className="text-right p-2">vs Cheapest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {azureCost && (
                        <tr className="border-b">
                          <td className="p-2 font-medium text-azure">Azure</td>
                          <td className="p-2 text-right font-mono">£{azureCost.monthlyRate.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono font-bold">£{azureCost.total.toLocaleString()}</td>
                          <td className="p-2 text-right">
                            {lowestCost && (
                              <span className={azureCost.total === lowestCost.cost ? 'text-green-600 font-bold' : ''}>
                                {azureCost.total === lowestCost.cost ? 'Best' : `+£${(azureCost.total - lowestCost.cost).toLocaleString()}`}
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                      {awsCost && (
                        <tr className="border-b">
                          <td className="p-2 font-medium text-aws">AWS</td>
                          <td className="p-2 text-right font-mono">£{awsCost.monthlyRate.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono font-bold">£{awsCost.total.toLocaleString()}</td>
                          <td className="p-2 text-right">
                            {lowestCost && (
                              <span className={awsCost.total === lowestCost.cost ? 'text-green-600 font-bold' : ''}>
                                {awsCost.total === lowestCost.cost ? 'Best' : `+£${(awsCost.total - lowestCost.cost).toLocaleString()}`}
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                      {onPremCost && (
                        <tr>
                          <td className="p-2 font-medium text-onprem">On-Premises</td>
                          <td className="p-2 text-right font-mono">£{(onPremCost.power / 36).toFixed(2)}</td>
                          <td className="p-2 text-right font-mono font-bold">£{onPremCost.total.toLocaleString()}</td>
                          <td className="p-2 text-right">
                            {lowestCost && (
                              <span className={onPremCost.total === lowestCost.cost ? 'text-green-600 font-bold' : ''}>
                                {onPremCost.total === lowestCost.cost ? 'Best' : `+£${(onPremCost.total - lowestCost.cost).toLocaleString()}`}
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>* Prices are estimates based on standard pricing as of 2024</p>
                  <p>* On-premises hardware pricing based on 3-year-old enterprise equipment from bargain hardware suppliers</p>
                  <p>* Power costs calculated at £0.25/kWh including 40% cooling overhead</p>
                  <p>* Storage pricing based on enterprise SSD requirements, not just allocated space</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HardwareCostComparison